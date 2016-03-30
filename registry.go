package main

import (
	"fmt"
	"github.com/elazarl/goproxy"
	"github.com/jackc/pgx"
	"github.com/pquerna/ffjson/ffjson"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"
)

func checkError(err error) {
	if err != nil {
		log.Fatalf("Error: %s", err)
	}
}

func UrlHasPrefix(prefix string) goproxy.ReqConditionFunc {
	return func(req *http.Request, ctx *goproxy.ProxyCtx) bool {
		return req.Method == http.MethodGet && strings.HasPrefix(req.URL.Path, prefix)
	}
}

var pool *pgx.ConnPool

func afterConnect(conn *pgx.Conn) (err error) {
	_, err = conn.Prepare("getPackage", `
		SELECT name, url FROM packages WHERE name = $1
  `)
	if err != nil {
		return
	}

	return
}

func main() {

	var err error
	pgxcfg, err := pgx.ParseURI(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Parse URI error: %s", err)
	}
	pool, err = pgx.NewConnPool(pgx.ConnPoolConfig{
		ConnConfig:     pgxcfg,
		MaxConnections: 10,
		AfterConnect:   afterConnect,
	})
	if err != nil {
		log.Fatalf("Connection error: %s", err)
	}
	defer pool.Close()

	port := os.Getenv("PORT")

	if port == "" {
		port = "3000"
	}

	binary, err := exec.LookPath("node")
	checkError(err)
	cmd := exec.Command(binary, "--expose_gc", "index.js")
	env := os.Environ()
	env = append([]string{"PORT=3001"}, env...)
	cmd.Env = env
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err = cmd.Start()
	checkError(err)
	defer func() {
		err = cmd.Wait()
		checkError(err)
	}()

	proxy := goproxy.NewProxyHttpServer()
	proxy.Verbose = true

	proxy.NonproxyHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		req.Host = "bower.herokuapp.com"
		req.URL.Scheme = "http"
		req.URL.Host = "localhost:3001"
		proxy.ServeHTTP(w, req)
	})

	proxy.OnRequest(UrlHasPrefix("/packages/")).DoFunc(
		func(r *http.Request, ctx *goproxy.ProxyCtx) (*http.Request, *http.Response) {
			var name string
			var url string
			elements := strings.Split(r.URL.Path, "/")
			packageName := elements[len(elements)-1]
			err := pool.QueryRow("getPackage", packageName).Scan(&name, &url)
			switch err {
			case nil:
				result := map[string]string{"name": name, "url": url}
				resultByteArray, _ := ffjson.Marshal(result)
				return r, goproxy.NewResponse(r, "application/json", http.StatusOK, string(resultByteArray))
			case pgx.ErrNoRows:
				return r, goproxy.NewResponse(r, "text/html", http.StatusNotFound, "Package not found")
			default:
				return r, goproxy.NewResponse(r, "text/html", http.StatusInternalServerError, "Internal server error")
			}
		})

	fmt.Println("Starting web server at port", port)

	log.Fatal(http.ListenAndServe(":"+port, proxy))
}
