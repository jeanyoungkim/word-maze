package service

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"path"
	"strings"

	"github.com/gorilla/mux"

	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/user"
)

func init() {
	r := mux.NewRouter()
	r.HandleFunc("/styles/{.*}", serveCSS)
	r.HandleFunc("/js/{.*}", serveJS)
	r.HandleFunc("/assets/{.*}", serveAssets)
	// main page
	r.HandleFunc("/", serveIndex)
	// any sub games
	r.PathPrefix("/fish").HandlerFunc(serveGame("fish"))
	r.PathPrefix("/plants").HandlerFunc(serveGame("plants"))
	r.PathPrefix("/color").HandlerFunc(serveGame("color"))
	r.PathPrefix("/palindrome").HandlerFunc(serveGame("palindrome"))

	// lockitdownnow
	http.Handle("/", secure(r))
}

func secure(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)
		w.Header().Set("Content-Type", "text/html; charset=utf8")
		usr := user.Current(ctx)
		if usr == nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if !strings.HasSuffix(usr.Email, "@nytimes.com") {
			log.Debugf(ctx, "auth domain rejected: %#v", usr)
			w.WriteHeader(http.StatusUnauthorized)
			io.WriteString(w, "please sign in with an @nytimes.com account")
			return
		}
		h.ServeHTTP(w, r)
	})
}

func serveIndex(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	usr := user.Current(ctx)

	w.Header().Set("Content-Type", "text/html; charset=utf8")
	tmpl, err := template.New("game").ParseFiles("./static/index.html")
	if err != nil {
		log.Criticalf(ctx, "unable to parse index.html: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	usrData, _ := json.Marshal(&usr)
	data := struct{ User template.JS }{template.JS(string(usrData))}
	err = tmpl.ExecuteTemplate(w, "index.html", &data)
	if err != nil {
		log.Criticalf(ctx, "template render fail: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func serveGame(game string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)
		usr := user.Current(ctx)

		_, name := path.Split(r.URL.Path)
		w.Header().Set("Content-Type", "text/html; charset=utf8")
		tmpl, err := template.New("game").ParseFiles(fmt.Sprintf("./static/%s/%s.html", game, name))
		if err != nil {
			log.Criticalf(ctx, "unable to parse index.html: %s", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		usrData, _ := json.Marshal(&usr)
		data := struct{ User template.JS }{template.JS(string(usrData))}
		err = tmpl.ExecuteTemplate(w, fmt.Sprintf("%s.html", name), &data)
		if err != nil {
			log.Criticalf(ctx, "template render fail: %s", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func serveCSS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/css")
	http.StripPrefix("/", http.FileServer(http.Dir("static/"))).ServeHTTP(w, r)
}

func serveAssets(w http.ResponseWriter, r *http.Request) {
	http.StripPrefix("/", http.FileServer(http.Dir("js/"))).ServeHTTP(w, r)
}

func serveJS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/javascript")
	http.StripPrefix("/", http.FileServer(http.Dir("static/"))).ServeHTTP(w, r)
}
