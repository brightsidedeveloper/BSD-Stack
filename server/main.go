package main

import (
	"encoding/json"
	"go-pmp/db"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type Test struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func main() {

	db.Connect()

	r := chi.NewRouter()
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {

		test := Test{
			Name: "Tim",
			Age:  23,
		}

		w.Header().Set("Content-Type", "application/json")

		json.NewEncoder(w).Encode(test)
	})
	http.ListenAndServe(":8080", r)
}
