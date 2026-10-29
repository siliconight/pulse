package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestLocalServer(t *testing.T) {
	h := handler("test-token", func() {})
	for _, tc := range []struct {
		path, method, host, origin, token string
		status                            int
	}{{"/", "GET", address, "", "", 200}, {"/heartbeat-core.js", "GET", address, "", "", 200}, {"/", "GET", "evil.example", "", "", 403}, {"/__pulse/stop", "GET", address, origin, "test-token", 403}, {"/__pulse/stop", "POST", address, "https://evil.example", "test-token", 403}, {"/__pulse/stop", "POST", address, origin, "", 403}, {"/__pulse/stop", "POST", address, origin, "test-token", 200}} {
		r := httptest.NewRequest(tc.method, "http://"+tc.host+tc.path, nil)
		r.Header.Set("Origin", tc.origin)
		r.Header.Set("X-Pulse-Token", tc.token)
		w := httptest.NewRecorder()
		h.ServeHTTP(w, r)
		if w.Code != tc.status {
			t.Fatalf("%s %s: %d", tc.method, tc.path, w.Code)
		}
		if tc.path == "/" && w.Code == http.StatusOK && !strings.Contains(w.Body.String(), "Stop Pulse") {
			t.Fatal("missing stop control")
		}
	}
}
