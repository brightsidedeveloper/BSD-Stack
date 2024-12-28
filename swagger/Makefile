API_JSON = api.json
OUTPUT_DIR = ../client/src/api
TYPES_FILE = $(OUTPUT_DIR)/types.ts
BSD_FILE = $(OUTPUT_DIR)/bsd.ts
BSD_GEN_SCRIPT = ./bsd-gen.js

g-docs:
	npx @redocly/cli build-docs $(API_JSON)
	open ./redoc-static.html

docs: 
	open ./redoc-static.html

bsd:
	@mkdir -p $(OUTPUT_DIR)
	node $(BSD_GEN_SCRIPT)

all: g-docs bsd