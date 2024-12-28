package handler

import (
	"encoding/json"
	"go-pmp/api"
	"net/http"
)

func (h *Handler) GetHealthStatus(w http.ResponseWriter, r *http.Request) {
	h.JSON.Success(w, api.V1HealthStatusResponse{Status: "ok"})
}

func (h *Handler) PostHealthStatus(w http.ResponseWriter, r *http.Request) {

	var req api.V1HealthStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.JSON.ValidationError(w, "Invalid request")
		return
	}

	if req.Health < 50 {
		h.JSON.Error(w, http.StatusBadRequest, "Invalid health status")
		return
	}

	h.JSON.Success(w, api.V1HealthStatusResponse{Status: "ok"})
}
