
// Auto-generated File - BSD

package routes

import (
  "go-pmp/internal/handler"
  "github.com/go-chi/chi/v5"
)


func AddAuthRoutes(r *chi.Mux, h *handler.Handler) {
  r.Post("/signup", h.PostSignup)
  r.Post("/login", h.PostLogin)
  
  r.Group(func(r chi.Router) {
    r.Use(h.AuthMiddleware)
    r.Post("/logout", h.PostLogout)
    r.Post("/deleteAccount", h.PostDeleteAccount)
  })

}


func AddV1Routes(r *chi.Mux, h *handler.Handler) {
  
  
  r.Group(func(r chi.Router) {
    r.Use(h.AuthMiddleware)
    r.Get("/test", h.GetTest)
    r.Post("/test", h.PostTest)
    r.Get("/me", h.GetMe)
    r.Get("/users", h.GetUsers)
  })

}

  