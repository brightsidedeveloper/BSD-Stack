package api

import (
	"encoding/json"
	"net/http"
)

func Write(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if payload == nil {
		http.Error(w, "No payload provided", http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(payload); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func Success(w http.ResponseWriter, payload interface{}) {
	Write(w, http.StatusOK, payload)
}

func Error(w http.ResponseWriter, status int, message string) {
	Write(w, status, map[string]string{"error": message})
}

func ValidationError(w http.ResponseWriter, message string) {
	Error(w, http.StatusUnprocessableEntity, message)
}
