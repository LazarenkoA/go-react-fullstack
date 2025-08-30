import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/userService';
import UserCard from '../components/UserCard';
import UserModal from '../components/UserModal';
import './Users.css';

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    select: (data) => data.data,
  });

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return <div className="loading">Загрузка пользователей...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error.message}</div>;
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>Пользователи</h1>
        <button onClick={handleCreateUser} className="btn btn-primary">
          Добавить пользователя
        </button>
      </div>

      <div className="users-list">
        {users && users.length > 0 ? (
          users.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              onEdit={handleEditUser}
            />
          ))
        ) : (
          <div className="no-users">
            <p>Пользователи не найдены</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <UserModal 
          user={selectedUser}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Users;