package handler

import (
	"encoding/json"
	"go-pmp/api"
	"net/http"
)

func (h *Handler) GetHealthStatus(w http.ResponseWriter, r *http.Request) {
	api.Success(w, api.V1HealthStatusResponse{Status: "ok"})
}

func (h *Handler) PostHealthStatus(w http.ResponseWriter, r *http.Request) {

	var req api.V1HealthStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Health < 50 {
		http.Error(w, "Invalid health status", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	api.Success(w, api.V1HealthStatusResponse{Status: "ok"})
}
