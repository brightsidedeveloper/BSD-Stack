package handler

import (
	"context"
	"go-pmp/api"
	"net/http"
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
