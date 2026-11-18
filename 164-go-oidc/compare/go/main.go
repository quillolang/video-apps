// Trail Club: log in with the club's OpenID Connect provider, through coreos/go-oidc and golang.org/x/oauth2.
package main

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"html"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
)

type user struct{ Sub, Name string }

var sessions sync.Map // a session's id, from its cookie: the user signed in

func main() {
	ctx := context.Background()
	provider, err := oidc.NewProvider(ctx, env("ISSUER", "http://localhost:4000"))
	if err != nil {
		log.Fatal(err)
	}
	conf := oauth2.Config{
		ClientID:     "trail-go",
		ClientSecret: os.Getenv("CLIENT_SECRET"),
		Endpoint:     provider.Endpoint(),
		RedirectURL:  env("BASE", "http://trail.localhost:8092") + "/callback",
		Scopes:       []string{oidc.ScopeOpenID, "profile"},
	}
	verifier := provider.Verifier(&oidc.Config{ClientID: conf.ClientID})
	css, _ := os.ReadFile("club.css")
	page := func(w http.ResponseWriter, status int, body string) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(status)
		head := "<!doctype html><title>Trail Club</title><style>" + string(css) + "</style>"
		w.Write([]byte(head + "<main>" + body + "</main>"))
	}

	http.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie("club")
		u, ok := sessions.Load(cookieValue(c, err))
		if !ok {
			page(w, 200, `<h1>Trail Club</h1><p><a href="/login">Log in</a></p>`)
			return
		}
		name, sub := html.EscapeString(u.(user).Name), html.EscapeString(u.(user).Sub)
		page(w, 200, "<h1>Trail Club: hello, "+name+"</h1><p class=\"who\">Signed in as "+sub+".</p>")
	})

	// To the provider, with a fresh state, a nonce and a PKCE verifier, each in a short-lived cookie.
	http.HandleFunc("GET /login", func(w http.ResponseWriter, r *http.Request) {
		state, nonce, pkce := random(), random(), oauth2.GenerateVerifier()
		for name, value := range map[string]string{"state": state, "nonce": nonce, "pkce": pkce} {
			http.SetCookie(w, &http.Cookie{Name: name, Value: value, Path: "/", MaxAge: 600,
				HttpOnly: true, SameSite: http.SameSiteLaxMode})
		}
		to := conf.AuthCodeURL(state, oidc.Nonce(nonce), oauth2.S256ChallengeOption(pkce))
		http.Redirect(w, r, to, http.StatusFound)
	})

	// Back from the provider: the same state; the code for tokens; the ID token checked; the user.
	http.HandleFunc("GET /callback", func(w http.ResponseWriter, r *http.Request) {
		state, err := r.Cookie("state")
		if err != nil || r.URL.Query().Get("state") != state.Value {
			page(w, 400, "<h1>This login wasn't started here</h1>")
			return
		}
		pkce, _ := r.Cookie("pkce")
		code := r.URL.Query().Get("code")
		tokens, err := conf.Exchange(r.Context(), code, oauth2.VerifierOption(cookieValue(pkce, nil)))
		if err != nil {
			page(w, 502, "<h1>The provider refused the code</h1>")
			return
		}
		raw, _ := tokens.Extra("id_token").(string)
		id, err := verifier.Verify(r.Context(), raw)
		nonce, _ := r.Cookie("nonce")
		if err != nil || id.Nonce != cookieValue(nonce, nil) {
			page(w, 502, "<h1>The ID token didn't check out</h1>")
			return
		}
		info, err := provider.UserInfo(r.Context(), oauth2.StaticTokenSource(tokens))
		var claims struct{ Name string }
		if err != nil || info.Claims(&claims) != nil {
			page(w, 502, "<h1>The provider didn't say who</h1>")
			return
		}
		session := random()
		sessions.Store(session, user{Sub: id.Subject, Name: claims.Name})
		http.SetCookie(w, &http.Cookie{Name: "club", Value: session, Path: "/",
			HttpOnly: true, SameSite: http.SameSiteLaxMode})
		http.Redirect(w, r, "/", http.StatusFound)
	})

	log.Fatal(http.ListenAndServe(":8092", nil))
}

func random() string {
	b := make([]byte, 24)
	rand.Read(b)
	return base64.RawURLEncoding.EncodeToString(b)
}

func cookieValue(c *http.Cookie, err error) string {
	if err != nil || c == nil {
		return ""
	}
	return c.Value
}

func env(name, fallback string) string {
	if v := os.Getenv(name); v != "" {
		return v
	}
	return fallback
}
