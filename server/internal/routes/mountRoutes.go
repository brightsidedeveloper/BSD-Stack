// Auto-generated File - BSD

package routes

import (
  "go-pmp/internal/handler"
  "github.com/go-chi/chi/v5"
)

func MountRoutes(r *chi.Mux, h *handler.Handler) {
  authRouter := chi.NewRouter()

  addAuthRoutes(authRouter, h)

  r.Mount("/api/auth", authRouter)


  v1Router := chi.NewRouter()

  addV1Routes(v1Router, h)

  r.Mount("/api/v1", v1Router)
}
