package handler

import (
	"context"
	"fmt"
	"go-pmp/api"
	"go-pmp/internal/session"
	"net/http"
	"time"
)

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	rows, err := h.DB.QueryContext(ctx, "SELECT id, email, created_at FROM auth.users")

	if err != nil {
		h.JSON.Error(w, http.StatusInternalServerError, "Failed to query users")
		return
	}
	defer rows.Close()

	users := make([]api.V1UsersResponseUsers, 0)
	for rows.Next() {
		var user api.V1UsersResponseUsers
		if err := rows.Scan(&user.Id, &user.Email, &user.CreatedAt); err != nil {
			h.JSON.Error(w, http.StatusInternalServerError, "Failed to scan users")
			return
		}
		users = append(users, user)
	}

	w.Header().Set("Content-Type", "application/json")
	h.JSON.Success(w, api.V1UsersResponse{Users: users})
}

func (h *Handler) GetMe(w http.ResponseWriter, r *http.Request) {

	userID, ok := session.GetUserID(r.Context())
	if !ok || userID == "" {
		h.JSON.Error(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	query := "SELECT id, email, created_at FROM auth.users WHERE id = $1"

	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	var id string
	var email string
	var createdAt string

	err := h.DB.QueryRowContext(ctx, query, userID).Scan(&id, &email, &createdAt)
	if err != nil {
		fmt.Println("err", err)
		h.JSON.Error(w, http.StatusInternalServerError, "Failed to query user")
		return
	}

	h.JSON.Write(w, http.StatusOK, api.V1MeResponse{
		Id:        id,
		Email:     email,
		CreatedAt: createdAt,
	})

}
