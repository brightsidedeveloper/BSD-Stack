package session

import (
	"fmt"
	"go-pmp/internal/handler"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func genJWT(userID string) (string, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", fmt.Errorf("JWT_SECRET not set")
	}

	claims := jwt.MapClaims{
		"userID": userID,
		"exp":    time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func WriteJWT(w http.ResponseWriter, h *handler.Handler, userID string) {
	token, err := genJWT(userID)
	if err != nil {
		h.JSON.Error(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	devMode := os.Getenv("DEV") == "true"

	// Web
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    token,
		HttpOnly: true,
		Secure:   !devMode,
		Path:     "/",
		MaxAge:   86400,
	})

	// Native
	h.JSON.Write(w, http.StatusOK, map[string]string{"token": token})
}
