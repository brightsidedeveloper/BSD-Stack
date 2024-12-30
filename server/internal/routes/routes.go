package routes

import (
	"go-pmp/internal/handler"

	"github.com/go-chi/chi/v5"
)

func AddAuthRoutes(r *chi.Mux, h *handler.Handler) {
	r.Post("/signup", h.SignUp)
	r.Post("/login", h.Login)

	r.Group(func(r chi.Router) {
		r.Use(h.AuthMiddleware)
		r.Post("/logout", h.Logout)
		r.Post("/deleteAccount", h.DeleteAccount)
	})
}

func AddV1Routes(r *chi.Mux, h *handler.Handler) {
	r.Post("/health", h.PostHealth)
	r.Get("/users", h.GetUsers)

	r.Group(func(r chi.Router) {
		r.Use(h.AuthMiddleware)
		r.Get("/health", h.GetHealth)
		r.Get(("/me"), h.GetMe)
	})
}
