package handler

import (
	"context"
	"go-pmp/db"
	"go-pmp/internal/res"
	"net/http"
)

type User struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	CreatedAt string `json:"createdAt"`
}

type Handler struct {
	DB *db.Postgres
}

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	rows, err := h.DB.Query(ctx, "SELECT id, email, created_at FROM auth.users")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	users := make([]User, 0)
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Email, &user.CreatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	w.Header().Set("Content-Type", "application/json")
	res.JSON(w, http.StatusOK, users)
}
