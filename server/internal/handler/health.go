package handler

import (
	"encoding/json"
	"go-pmp/api"
	"go-pmp/internal/session"
	"net/http"
)

func (h *Handler) GetHealth(w http.ResponseWriter, r *http.Request) {
	userID, ok := session.GetUserID(r.Context())
	if !ok {
		h.JSON.Error(w, http.StatusUnauthorized, "Not logged in")
		return
	}
	h.JSON.Success(w, api.HealthStatusResponse{Status: userID})
}

func (h *Handler) PostHealth(w http.ResponseWriter, r *http.Request) {

	var req api.HealthStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.JSON.ValidationError(w, "Invalid request")
		return
	}

	if req.Health < 50 {
		h.JSON.Error(w, http.StatusBadRequest, "Invalid health status")
		return
	}

	h.JSON.Success(w, api.HealthStatusResponse{Status: "ok"})
}
