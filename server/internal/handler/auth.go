package handler

import (
	"context"
	"database/sql"
	"encoding/json"
	"go-pmp/api"
	"net/http"
	"regexp"
	"time"

	"github.com/jackc/pgx/v5/pgconn"
	"golang.org/x/crypto/bcrypt"
)

var emailRegex = regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,8}$`)

func isValidEmail(email string) bool {
	return emailRegex.MatchString(email)
}

func (h *Handler) SignUp(w http.ResponseWriter, r *http.Request) {
	var req api.V1UserSignUpRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		api.ValidationError(w, "Invalid Request")
		return
	}

	if !isValidEmail(req.Email) {
		api.ValidationError(w, "Invalid email")
		return
	}

	if len(req.Password) < 8 {
		api.ValidationError(w, "Password must be at least 8 characters.")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		api.Error(w, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	query := `INSERT INTO auth.users (email, password_hash) VALUES ($1, $2) RETURNING id`
	var id string

	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	err = h.DB.QueryRowContext(ctx, query, req.Email, hash).Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			api.Error(w, http.StatusInternalServerError, "Error, no rows returned")
			return
		}
		if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
			api.ValidationError(w, "Email already exists")
			return
		}
		api.Error(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	api.Write(w, http.StatusCreated, api.V1UserSignUpResponse{Id: id})
}
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req api.V1UserLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		api.ValidationError(w, "Invalid Request")
		return
	}

	var id string
	var hash string
	query := `SELECT id, password_hash FROM auth.users WHERE email = $1`

	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	err := h.DB.QueryRowContext(ctx, query, req.Email).Scan(&id, &hash)
	if err != nil {
		if err == sql.ErrNoRows {
			api.Error(w, http.StatusUnauthorized, "Invalid email or password")
			return
		}
		api.Error(w, http.StatusInternalServerError, "Failed to authenticate")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password))
	if err != nil {
		api.Error(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	api.Write(w, http.StatusOK, api.V1UserLoginResponse{Id: id})
}
