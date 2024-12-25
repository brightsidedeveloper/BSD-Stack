package main

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type Test struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func main() {
	r := chi.NewRouter()
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {

		test := Test{
			Name: "John",
			Age:  25,
		}

		w.Header().Set("Content-Type", "application/json")

		json.NewEncoder(w).Encode(test)
	})
	http.ListenAndServe(":8080", r)
}
