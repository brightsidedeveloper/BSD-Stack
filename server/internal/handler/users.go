package handler

import (
	"context"
	"go-pmp/api"
	"net/http"
)

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	rows, err := h.DB.Query(ctx, "SELECT id, email, created_at FROM auth.users")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	users := make([]api.V1UsersResponseUsers, 0)
	for rows.Next() {
		var user api.V1UsersResponseUsers
		if err := rows.Scan(&user.Id, &user.Email, &user.CreatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	w.Header().Set("Content-Type", "application/json")
	api.Success(w, api.V1UsersResponse{Users: users})
}
