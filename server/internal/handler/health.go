package handler

import (
	"go-pmp/internal/res"
	"net/http"
)

type HealthCheckResponse struct {
	Status string `json:"status"`
}

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	res.JSON(w, http.StatusOK, HealthCheckResponse{Status: "OK"})
}
