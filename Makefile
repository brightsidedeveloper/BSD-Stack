ifneq (,$(wildcard .env))
include .env
export
endif


# SWAGGER

API_JSON = ./swagger/api.json
BSD_GEN_SCRIPT = ./swagger/bsd-gen.js

g-docs:
	npx @redocly/cli build-docs $(API_JSON) -o ./swagger/bsd-docs.html
	open ./swagger/bsd-docs.html

docs: 
	open ./swagger/bsd-docs.html

bsd:
	node $(BSD_GEN_SCRIPT)

# MIGRATIONS

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

