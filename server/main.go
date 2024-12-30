package main

import (
	"context"
	"database/sql"
	"go-pmp/db"
	"go-pmp/internal/handler"
	"go-pmp/internal/routes"
	"go-pmp/internal/util"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {

	loadEnv()

	db := connectDB()
	defer db.Close()

	j := &util.JSON{}

	h := &handler.Handler{DB: db, JSON: j}

	r := chi.NewRouter()

	addCors(r)

	authRouter := chi.NewRouter()

	routes.AddAuthRoutes(authRouter, h)

	r.Mount("/api/auth", authRouter)

	v1Router := chi.NewRouter()

	routes.AddV1Routes(v1Router, h)

	r.Mount("/api/v1", v1Router)

	devMode := os.Getenv("DEV") == "true"

	if devMode {
		addViteProxy(r)
	} else {
		addClientRoutes(r)
	}

	gracefullyServe(r)
}

func loadEnv() {
	if err := godotenv.Load(); err != nil {
		dev := os.Getenv("DEV")
		if len(dev) == 0 {
			log.Fatal("$DEV must be set")
		}
		log.Println(".env file loaded successfully")
	} else {
		dev := os.Getenv("DEV")
		if len(dev) == 0 {
			log.Fatal("$DEV must be set")
		}
		log.Println(".env file loaded successfully")
	}
}

func connectDB() *sql.DB {
	dsn := os.Getenv("DSN")
	if dsn == "" {
		log.Fatal("$DSN must be set")
	}
	db, err := db.CreateDB(dsn)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	return db
}

func addCors(r *chi.Mux) {
	origin := os.Getenv("ORIGIN")
	if origin == "" {
		log.Fatal("$ORIGIN must be set")
	}
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{origin},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))
}

func addViteProxy(r *chi.Mux) {
	viteServerURL := os.Getenv("VITE_SERVER_URL")
	if viteServerURL == "" {
		log.Fatal("$VITE_SERVER_URL must be set")
	}
	proxyURL, err := url.Parse(viteServerURL)
	if err != nil {
		log.Fatalf("Invalid VITE_SERVER_URL: %v", err)
	}
	proxy := httputil.NewSingleHostReverseProxy(proxyURL)

	r.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		r.URL.Host = proxyURL.Host
		r.URL.Scheme = proxyURL.Scheme
		r.Host = proxyURL.Host
		proxy.ServeHTTP(w, r)
	})
}

func addClientRoutes(r *chi.Mux) {
	distPath := os.Getenv("DIST_DIR")
	if distPath == "" {
		log.Fatal("$DIST_DIR must be set")
	}
	staticHandler := http.FileServer(http.Dir(distPath))
	r.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		filePath := distPath + r.URL.Path
		_, err := os.Stat(filePath)
		if os.IsNotExist(err) {
			http.ServeFile(w, r, distPath+"/index.html")
			return
		}
		staticHandler.ServeHTTP(w, r)
	})
}

func gracefullyServe(r *chi.Mux) {
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("$PORT must be set")
	}

	server := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Println("Starting server on port " + port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("ListenAndServe error: %v", err)
		}
	}()

	<-shutdown
	log.Println("Shutting down gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server stopped cleanly")
}
