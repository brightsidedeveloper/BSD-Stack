package db

import (
	"context"
	"database/sql"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib" // PostgreSQL driver
)

var DB *sql.DB

func Connect() {
	var err error

	// Update the connection string if necessary
	dsn := "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable"

	DB, err = sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("Error opening database: %v\n", err)
	}

	// Test the connection
	if err := DB.PingContext(context.Background()); err != nil {
		log.Fatalf("Error pinging database: %v\n", err)
	}

	log.Println("Database connected successfully!")
}
