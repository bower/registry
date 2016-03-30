package main

import (
	"fmt"
	"github.com/elazarl/goproxy"
	"log"
	"net/http"
	"os"
)

func main() {

	port := os.Getenv("PORT")

	if port == "" {
		port = "3000"
	}

	proxy := goproxy.NewProxyHttpServer()
	proxy.Verbose = true

	proxy.NonproxyHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		req.Host = "bower.herokuapp.com"
		req.URL.Scheme = "http"
		req.URL.Host = "localhost:80"
		proxy.ServeHTTP(w, req)
	})

	fmt.Println("Starting web server at port", port)

	log.Fatal(http.ListenAndServe(":"+port, proxy))
}
