package main

import (
	"fmt"
	"github.com/elazarl/goproxy"
	"log"
	"net/http"
	"os"
	"os/exec"
)

func checkError(err error) {
	if err != nil {
		log.Fatalf("Error: %s", err)
	}
}

func main() {

	port := os.Getenv("PORT")

	if port == "" {
		port = "3000"
	}

	fmt.Println(port)
	binary, err := exec.LookPath("node")
	fmt.Println(binary)

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

	fmt.Println("Starting web server at port", port)

	log.Fatal(http.ListenAndServe(":"+port, proxy))
}
