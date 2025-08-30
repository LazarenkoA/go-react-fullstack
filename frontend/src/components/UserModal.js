import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser } from '../services/userService';
import './UserModal.css';

const UserModal = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
  });
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        age: user.age.toString(),
      });
    }
  }, [user]);

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      onClose();
    },
    onError: (error) => {
      console.error('Ошибка создания:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, userData }) => updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      onClose();
    },
    onError: (error) => {
      console.error('Ошибка обновления:', error);
    },
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!formData.age) {
      newErrors.age = 'Возраст обязателен';
    } else if (isNaN(formData.age) || formData.age < 0 || formData.age > 120) {
      newErrors.age = 'Возраст должен быть числом от 0 до 120';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      age: parseInt(formData.age),
    };

    if (isEditing) {
      updateMutation.mutate({ id: user.id, userData });
    } else {
      createMutation.mutate(userData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Очищаем ошибку для поля при вводе
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Редактировать пользователя' : 'Создать пользователя'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="name">Имя:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isEditing} // Email нельзя изменить при редактировании
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="age">Возраст:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? 'error' : ''}
              min="0"
              max="120"
            />
            {errors.age && <span className="error-text">{errors.age}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {createMutation.isLoading || updateMutation.isLoading 
                ? 'Сохранение...' 
                : isEditing ? 'Обновить' : 'Создать'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;