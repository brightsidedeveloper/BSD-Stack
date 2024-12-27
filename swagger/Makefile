API_JSON = api.json
OUTPUT_DIR = ../client/src/api
TYPES_FILE = $(OUTPUT_DIR)/types.ts
BSD_FILE = $(OUTPUT_DIR)/bsd.ts
BSD_GEN_SCRIPT = ./bsd-gen.js

# Target to build documentation using Redoc
docs:
	npx @redocly/cli build-docs $(API_JSON)

bsd:
	@mkdir -p $(OUTPUT_DIR)
	node $(BSD_GEN_SCRIPT)

# Target to run both docs and types
all: docs bsd