package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"your-app/internal/models"
	"your-app/internal/services"
)

// GetUsers возвращает список всех пользователей
func GetUsers(c *gin.Context) {
	users, err := services.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Не удалось получить список пользователей",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  users,
		"count": len(users),
	})
}

// GetUserByID возвращает пользователя по ID
func GetUserByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Некорректный ID пользователя",
		})
		return
	}

	user, err := services.GetUserByID(uint(id))
	if err != nil {
		if err.Error() == "пользователь не найден" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Пользователь не найден",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Ошибка при получении пользователя",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": user,
	})
}

// CreateUser создает нового пользователя
func CreateUser(c *gin.Context) {
	var req models.CreateUserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Неверный формат данных",
			"details": err.Error(),
		})
		return
	}

	user, err := services.CreateUser(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Не удалось создать пользователя",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data":    user,
		"message": "Пользователь успешно создан",
	})
}

// UpdateUser обновляет существующего пользователя
func UpdateUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Некорректный ID пользователя",
		})
		return
	}

	var req models.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Неверный формат данных",
			"details": err.Error(),
		})
		return
	}

	user, err := services.UpdateUser(uint(id), &req)
	if err != nil {
		if err.Error() == "пользователь не найден" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Пользователь не найден",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Не удалось обновить пользователя",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    user,
		"message": "Пользователь успешно обновлен",
	})
}

// DeleteUser удаляет пользователя
func DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Некорректный ID пользователя",
		})
		return
	}

	err = services.DeleteUser(uint(id))
	if err != nil {
		if err.Error() == "пользователь не найден" {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Пользователь не найден",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Не удалось удалить пользователя",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Пользователь успешно удален",
	})
}

// HealthCheck проверяет состояние API
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"message": "API работает нормально",
	})
}
