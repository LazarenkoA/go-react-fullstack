package services

import (
	"errors"
	"sync"
	"time"

	"your-app/internal/models"
)

// In-memory хранилище для демонстрации
var (
	users   = make(map[uint]*models.User)
	usersMu = sync.RWMutex{}
	nextID  = uint(1)
)

func init() {
	// Добавляем тестовых пользователей
	users[1] = &models.User{
		ID:        1,
		Name:      "Александр Иванов",
		Email:     "alex@example.com",
		Age:       30,
		CreatedAt: time.Now().AddDate(0, 0, -10),
		UpdatedAt: time.Now().AddDate(0, 0, -5),
	}
	users[2] = &models.User{
		ID:        2,
		Name:      "Мария Петрова",
		Email:     "maria@example.com",
		Age:       25,
		CreatedAt: time.Now().AddDate(0, 0, -8),
		UpdatedAt: time.Now().AddDate(0, 0, -3),
	}
	nextID = 3
}

// GetAllUsers возвращает всех пользователей
func GetAllUsers() ([]*models.User, error) {
	usersMu.RLock()
	defer usersMu.RUnlock()

	result := make([]*models.User, 0, len(users))
	for _, user := range users {
		result = append(result, user)
	}

	return result, nil
}

// GetUserByID возвращает пользователя по ID
func GetUserByID(id uint) (*models.User, error) {
	usersMu.RLock()
	defer usersMu.RUnlock()

	user, exists := users[id]
	if !exists {
		return nil, errors.New("пользователь не найден")
	}

	return user, nil
}

// CreateUser создает нового пользователя
func CreateUser(req *models.CreateUserRequest) (*models.User, error) {
	usersMu.Lock()
	defer usersMu.Unlock()

	// Проверяем уникальность email
	for _, user := range users {
		if user.Email == req.Email {
			return nil, errors.New("пользователь с таким email уже существует")
		}
	}

	now := time.Now()
	user := &models.User{
		ID:        nextID,
		Name:      req.Name,
		Email:     req.Email,
		Age:       req.Age,
		CreatedAt: now,
		UpdatedAt: now,
	}

	users[nextID] = user
	nextID++

	return user, nil
}

// UpdateUser обновляет существующего пользователя
func UpdateUser(id uint, req *models.UpdateUserRequest) (*models.User, error) {
	usersMu.Lock()
	defer usersMu.Unlock()

	user, exists := users[id]
	if !exists {
		return nil, errors.New("пользователь не найден")
	}

	// Обновляем только переданные поля
	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Age > 0 {
		user.Age = req.Age
	}

	user.UpdatedAt = time.Now()

	return user, nil
}

// DeleteUser удаляет пользователя
func DeleteUser(id uint) error {
	usersMu.Lock()
	defer usersMu.Unlock()

	if _, exists := users[id]; !exists {
		return errors.New("пользователь не найден")
	}

	delete(users, id)
	return nil
}
