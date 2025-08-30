package models

import (
	"time"
)

// User представляет модель пользователя
type User struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Age       int       `json:"age"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// CreateUserRequest структура для создания пользователя
type CreateUserRequest struct {
	Name  string `json:"name" binding:"required,min=2,max=50" example:"Иван Петров"`
	Email string `json:"email" binding:"required,email" example:"ivan@example.com"`
	Age   int    `json:"age" binding:"required,min=0,max=120" example:"25"`
}

// UpdateUserRequest структура для обновления пользователя
type UpdateUserRequest struct {
	Name string `json:"name" binding:"omitempty,min=2,max=50" example:"Иван Петров"`
	Age  int    `json:"age" binding:"omitempty,min=0,max=120" example:"26"`
}

// Validate проверяет корректность данных пользователя
func (u *CreateUserRequest) Validate() error {
	// Дополнительная валидация может быть добавлена здесь
	return nil
}
