package main

import (
	"context"
	"crypto/rand"
	"embed"
	"encoding/hex"
	"fmt"
	"io/fs"
	"net"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"runtime"
	"strings"
	"time"
)

//go:embed dist/*
var assets embed.FS

var version = "development"

const address = "127.0.0.1:48761"
const origin = "http://" + address

func openBrowser(url string) error {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "darwin":
		cmd = exec.Command("open", url)
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	default:
		cmd = exec.Command("xdg-open", url)
	}
	return cmd.Run()
}
func handler(token string, stop func()) http.Handler {
	files, _ := fs.Sub(assets, "dist")
	static := http.FileServer(http.FS(files))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Host != address {
			http.Error(w, "Invalid host", 403)
			return
		}
		w.Header().Set("Cache-Control", "no-store")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Referrer-Policy", "no-referrer")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Cross-Origin-Resource-Policy", "same-origin")
		w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		w.Header().Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
		if r.URL.Path == "/__pulse/health" {
			w.Header().Set("Content-Type", "text/plain")
			fmt.Fprint(w, "pulse-local-v1")
			return
		}
		if r.URL.Path == "/__pulse/stop" {
			if r.Method != "POST" || r.Header.Get("Origin") != origin || r.Header.Get("X-Pulse-Token") != token {
				http.Error(w, "Not allowed", 403)
				return
			}
			fmt.Fprint(w, "Stopped")
			go func() { time.Sleep(100 * time.Millisecond); stop() }()
			return
		}
		if r.Method != "GET" && r.Method != "HEAD" {
			http.Error(w, "Not allowed", 405)
			return
		}
		if r.URL.Path == "/" || r.URL.Path == "/index.html" {
			b, _ := assets.ReadFile("dist/index.html")
			extra := `<script>addEventListener('DOMContentLoaded',()=>{const bar=document.createElement('div');bar.style='padding:12px;text-align:center';bar.innerHTML='<strong>Pulse is running locally</strong> · <button id="quitLocalPulse">Stop Pulse</button> <small>Finish recording and save your downloads before stopping.</small>';document.body.prepend(bar);document.getElementById('quitLocalPulse').onclick=async()=>{if(!confirm('Stop Pulse? Finish and download any recording first.'))return;try{const r=await fetch('/__pulse/stop',{method:'POST',headers:{'X-Pulse-Token':'` + token + `'}});if(!r.ok)throw Error();document.querySelectorAll('audio').forEach(a=>a.pause());document.body.innerHTML='<main><h1>Pulse stopped.</h1><p>You can close this tab. Double-click Start Pulse to open it again.</p></main>'}catch{alert('Could not stop the launcher. Close its window to stop Pulse.')}}});</script>`
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			fmt.Fprint(w, strings.Replace(string(b), "</body>", extra+"</body>", 1))
			return
		}
		static.ServeHTTP(w, r)
	})
}
func main() {
	client := http.Client{Timeout: time.Second}
	if r, err := client.Get(origin + "/__pulse/health"); err == nil {
		defer r.Body.Close()
		buf := make([]byte, 64)
		n, _ := r.Body.Read(buf)
		if string(buf[:n]) == "pulse-local-v1" {
			fmt.Println("Opening existing Pulse session:", origin)
			_ = openBrowser(origin)
			return
		}
	}
	listener, err := net.Listen("tcp", address)
	if err != nil {
		fmt.Fprintln(os.Stderr, "Pulse could not start. Port 48761 is already in use. Close the other app and try again.")
		os.Exit(1)
	}
	bytes := make([]byte, 32)
	if _, err = rand.Read(bytes); err != nil {
		panic(err)
	}
	done := make(chan struct{}, 1)
	stop := func() {
		select {
		case done <- struct{}{}:
		default:
		}
	}
	server := &http.Server{Handler: handler(hex.EncodeToString(bytes), stop), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 30 * time.Second, IdleTimeout: 30 * time.Second, MaxHeaderBytes: 16 << 10}
	go func() {
		if err := server.Serve(listener); err != nil && err != http.ErrServerClosed {
			fmt.Fprintln(os.Stderr, err)
			stop()
		}
	}()
	fmt.Println("Pulse v"+version+" is ready:", origin, "\nKeep this launcher open. Use Stop Pulse in the browser when finished.")
	if err := openBrowser(origin); err != nil {
		fmt.Println("Open the address above in your browser.")
	}
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)
	select {
	case <-done:
	case <-signals:
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	_ = server.Shutdown(ctx)
}
