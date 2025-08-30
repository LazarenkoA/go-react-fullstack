package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"your-app/internal/config"
	"your-app/internal/handlers"
	"your-app/internal/middleware"
)

func main() {
	// Загружаем конфигурацию
	cfg := config.Load()

	// Создаем Gin роутер
	r := gin.Default()

	// Настраиваем middleware
	r.Use(middleware.CORS())
	r.Use(middleware.Logger())

	// Группа API маршрутов
	api := r.Group("/api/v1")
	{
		// Маршруты для работы с пользователями
		api.GET("/users", handlers.GetUsers)
		api.GET("/users/:id", handlers.GetUserByID)
		api.POST("/users", handlers.CreateUser)
		api.PUT("/users/:id", handlers.UpdateUser)
		api.DELETE("/users/:id", handlers.DeleteUser)

		// Маршрут для проверки здоровья API
		api.GET("/health", handlers.HealthCheck)
	}

	// Создаем HTTP сервер с таймаутами
	srv := &http.Server{
		Addr:           ":" + cfg.Port,
		Handler:        r,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Printf("Сервер запущен на порту %s", cfg.Port)
	log.Fatal(srv.ListenAndServe())
}
