package handler

import (
	"database/sql"
	"go-pmp/internal/util"
)

type Handler struct {
	DB   *sql.DB
	JSON *util.JSON
}
