import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../services/userService';
import './UserCard.css';

const UserCard = ({ user, onEdit }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      alert('Пользователь успешно удален');
    },
    onError: (error) => {
      console.error('Ошибка при удалении пользователя:', error);
      alert('Не удалось удалить пользователя');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      deleteMutation.mutate(user.id);
    }
  };

  return (
    <div className="user-card">
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">{user.email}</p>
        <p className="user-age">Возраст: {user.age}</p>
        <p className="user-date">
          Создан: {new Date(user.created_at).toLocaleDateString('ru-RU')}
        </p>
      </div>

      <div className="user-actions">
        <button 
          onClick={() => onEdit(user)} 
          className="btn btn-edit"
          disabled={deleteMutation.isLoading}
        >
          Редактировать
        </button>
        <button 
          onClick={handleDelete} 
          className="btn btn-delete"
          disabled={deleteMutation.isLoading}
        >
          {deleteMutation.isLoading ? 'Удаление...' : 'Удалить'}
        </button>
      </div>
    </div>
  );
};

export default UserCard;