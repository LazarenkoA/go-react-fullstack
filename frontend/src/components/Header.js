import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>Go + React App</h1>
        </Link>
        <nav className="nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Главная
          </Link>
          <Link 
            to="/users" 
            className={location.pathname === '/users' ? 'nav-link active' : 'nav-link'}
          >
            Пользователи
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;