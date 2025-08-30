package config

import (
	"os"
	"strconv"
)

// Config структура конфигурации приложения
type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
	Environment string
	LogLevel    string
}

// Load загружает конфигурацию из переменных окружения
func Load() *Config {
	return &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://user:password@localhost:5432/mydb?sslmode=disable"),
		JWTSecret:   getEnv("JWT_SECRET", "your-secret-key"),
		Environment: getEnv("ENVIRONMENT", "development"),
		LogLevel:    getEnv("LOG_LEVEL", "info"),
	}
}

// getEnv возвращает значение переменной окружения или значение по умолчанию
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// GetEnvAsInt возвращает переменную окружения как integer
func GetEnvAsInt(name string, defaultVal int) int {
	valueStr := getEnv(name, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultVal
}

// GetEnvAsBool возвращает переменную окружения как boolean
func GetEnvAsBool(name string, defaultVal bool) bool {
	valStr := getEnv(name, "")
	if val, err := strconv.ParseBool(valStr); err == nil {
		return val
	}
	return defaultVal
}
