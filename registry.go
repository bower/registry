package main

import (
	"fmt"
	"github.com/bmizerany/mc"
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

func PathIs(path string) goproxy.ReqConditionFunc {
	return func(req *http.Request, ctx *goproxy.ProxyCtx) bool {
		return req.Method == http.MethodGet && req.URL.Path == path
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

	memcached_url := os.Getenv("MEMCACHEDCLOUD_SERVERS")
	memcached_username := os.Getenv("MEMCACHEDCLOUD_USERNAME")
	memcached_password := os.Getenv("MEMCACHEDCLOUD_PASSWORD")

	if memcached_url == "" {
		memcached_url = "localhost:11211"
	}

	cn, err := mc.Dial("tcp", memcached_url)
	if err != nil {
		log.Fatalf("Memcached connection error: %s", err)
	}

	if memcached_url != "" && memcached_password != "" {
		err = cn.Auth(memcached_username, memcached_password)
		if err != nil {
			log.Fatalf("Memcached auth error: %s", err)
		}
	}

	pgxcfg, err := pgx.ParseURI(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Parse URI error: %s", err)
	}
	pool, err = pgx.NewConnPool(pgx.ConnPoolConfig{
		ConnConfig:     pgxcfg,
		MaxConnections: 20,
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

	proxy.Verbose = false

	proxy.NonproxyHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		req.Host = "bower.herokuapp.com"
		req.URL.Scheme = "http"
		req.URL.Host = "localhost:3001"
		proxy.ServeHTTP(w, req)
	})

	proxy.OnRequest(PathIs("/packages")).DoFunc(
		func(r *http.Request, ctx *goproxy.ProxyCtx) (*http.Request, *http.Response) {
			var val string

			val, _, _, err = cn.Get("packages")

			switch err {
			case nil:
				fmt.Println("MEMCACHED FROM GO SERVER")
				return r, goproxy.NewResponse(r, "application/json", http.StatusOK, val)
			default:
				return r, nil
			}

			return r, nil
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
