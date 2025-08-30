import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../services/userService';
import './UserDetail.css';

const UserDetail = () => {
  const { id } = useParams();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    select: (data) => data.data,
  });

  if (isLoading) {
    return <div className="loading">Загрузка пользователя...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Ошибка: {error.message}</p>
        <Link to="/users" className="btn btn-primary">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="user-detail">
      <div className="user-detail-header">
        <Link to="/users" className="back-link">
          ← Назад к списку
        </Link>
        <h1>Детали пользователя</h1>
      </div>

      {user && (
        <div className="user-detail-card">
          <div className="user-avatar">
            <div className="avatar-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="user-info">
            <h2>{user.name}</h2>
            <div className="info-item">
              <strong>Email:</strong> {user.email}
            </div>
            <div className="info-item">
              <strong>Возраст:</strong> {user.age} лет
            </div>
            <div className="info-item">
              <strong>Дата создания:</strong> {' '}
              {new Date(user.created_at).toLocaleString('ru-RU')}
            </div>
            <div className="info-item">
              <strong>Последнее обновление:</strong> {' '}
              {new Date(user.updated_at).toLocaleString('ru-RU')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;