package main

import (
	"context"
	"encoding/json"
	"os"

	"gopkg.in/yaml.v3"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// ReadAPI reads the YAML file and returns its content as a string
func (a *App) ReadAPI() (string, error) {
	// Read the YAML file
	data, err := os.ReadFile("../swagger/api.yaml")
	if err != nil {
		return "", err
	}

	// Unmarshal YAML into a generic map
	var yamlData map[string]interface{}
	err = yaml.Unmarshal(data, &yamlData)
	if err != nil {
		return "", err
	}

	// Convert the map to JSON
	jsonData, err := json.MarshalIndent(yamlData, "", "  ")
	if err != nil {
		return "", err
	}

	// Return the JSON as a string
	return string(jsonData), nil
}

// UpdateAPI updates the YAML file with the provided content
func (a *App) UpdateAPI(newContent string) error {
	return os.WriteFile("../swagger/api.yaml", []byte(newContent), 0644)
}
