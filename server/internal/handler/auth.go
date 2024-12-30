package handler

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"go-pmp/api"
	"go-pmp/internal/session"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
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
		h.JSON.ValidationError(w, "Invalid Request")
		return
	}

	if !isValidEmail(req.Email) {
		h.JSON.ValidationError(w, "Invalid email")
		return
	}

	if len(req.Password) < 8 {
		h.JSON.ValidationError(w, "Password must be at least 8 characters.")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		h.JSON.Error(w, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	query := `INSERT INTO auth.users (email, provider, password_hash) VALUES ($1, $2, $3) RETURNING id`
	var id string

	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	err = h.DB.QueryRowContext(ctx, query, req.Email, "local", hash).Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			h.JSON.Error(w, http.StatusInternalServerError, "Error, no rows returned")
			return
		}
		if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
			h.JSON.ValidationError(w, "Email already exists")
			return
		}
		h.JSON.Error(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	writeJWT(w, h, id)
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req api.V1UserLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.JSON.ValidationError(w, "Invalid Request")
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
			h.JSON.Error(w, http.StatusUnauthorized, "Invalid email or password")
			return
		}
		h.JSON.Error(w, http.StatusInternalServerError, "Failed to authenticate")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password))
	if err != nil {
		h.JSON.Error(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}
	writeJWT(w, h, id)
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	setAuthCookie(w, "")
	h.JSON.Write(w, http.StatusOK, api.V1UserAuthResponse{Token: ""})
}

func (h *Handler) DeleteAccount(w http.ResponseWriter, r *http.Request) {
	userID, ok := session.GetUserID(r.Context())
	if !ok || userID == "" {
		h.JSON.Error(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	query := `DELETE FROM auth.users WHERE id = $1`

	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	_, err := h.DB.ExecContext(ctx, query, userID)
	if err != nil {
		h.JSON.Error(w, http.StatusInternalServerError, "Failed to delete user")
		return
	}

	h.Logout(w, r)
}

func (h *Handler) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret == "" {
			h.JSON.Error(w, http.StatusInternalServerError, "Internal server error")
			return
		}

		var tokenString string

		cookie, err := r.Cookie("access_token")
		if err == nil {
			tokenString = cookie.Value
		}

		authHeader := r.Header.Get("Authorization")
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = strings.TrimPrefix(authHeader, "Bearer ")
		}

		if tokenString == "" {
			h.JSON.Error(w, http.StatusUnauthorized, "Unauthorized")
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(jwtSecret), nil
		})
		if err != nil || !token.Valid {
			h.JSON.Error(w, http.StatusUnauthorized, "Invalid token")
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			h.JSON.Error(w, http.StatusUnauthorized, "Invalid token claims")
			return
		}

		userID, ok := claims[session.ClaimsUserKey].(string)
		if !ok {
			h.JSON.Error(w, http.StatusUnauthorized, "Invalid user ID")
			return
		}

		ctx := session.SetUserID(r.Context(), userID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func writeJWT(w http.ResponseWriter, h *Handler, userID string) {
	token, err := session.GenJWT(userID)
	if err != nil {
		fmt.Println(err)
		h.JSON.Error(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	// Web & Desktop
	setAuthCookie(w, token)

	// Native
	h.JSON.Write(w, http.StatusOK, api.V1UserAuthResponse{
		Token: token,
	})
}

func setAuthCookie(w http.ResponseWriter, token string) {
	devMode := os.Getenv("DEV") == "true"

	var maxAge int
	if len(token) == 0 {
		maxAge = -1
	} else {
		maxAge = 86400
	}

	http.SetCookie(w, &http.Cookie{
		Name:     session.AccessTokenName,
		Value:    token,
		HttpOnly: true,
		Secure:   !devMode,
		Path:     "/",
		MaxAge:   maxAge,
	})
}
