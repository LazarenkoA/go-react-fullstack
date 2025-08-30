const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Базовая функция для HTTP запросов
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Получить всех пользователей
export const getUsers = () => {
  return apiRequest('/users');
};

// Получить пользователя по ID
export const getUserById = (id) => {
  return apiRequest(`/users/${id}`);
};

// Создать нового пользователя
export const createUser = (userData) => {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// Обновить пользователя
export const updateUser = (id, userData) => {
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// Удалить пользователя
export const deleteUser = (id) => {
  return apiRequest(`/users/${id}`, {
    method: 'DELETE',
  });
};

// Проверить состояние API
export const healthCheck = () => {
  return apiRequest('/health');
};