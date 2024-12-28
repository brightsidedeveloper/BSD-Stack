ifneq (,$(wildcard .env))
include .env
export
endif

pg:
	PGPASSWORD=$(POSTGRES_PASSWORD) psql -h localhost -U $(POSTGRES_USER) -d $(POSTGRES_DB)

mup:
	migrate -path $(MIGRATIONS_PATH) -database $(DATABASE_URL) up

mdown:
	migrate -path $(MIGRATIONS_PATH) -database $(DATABASE_URL) down -all

mforce:
	migrate -path $(MIGRATIONS_PATH) -database $(DATABASE_URL) force $(version)

mcreate:
	migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $(name)