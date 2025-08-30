import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">Добро пожаловать в Go + React App</h1>
        <p className="hero-subtitle">
          Демонстрация современного полнофункционального веб-приложения
        </p>
        <div className="hero-actions">
          <Link to="/users" className="btn btn-primary">
            Посмотреть пользователей
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>🚀 Высокая производительность</h3>
          <p>Go обеспечивает быструю обработку запросов и эффективное использование ресурсов</p>
        </div>
        <div className="feature-card">
          <h3>⚡ Современный UI</h3>
          <p>React предоставляет интерактивный и отзывчивый пользовательский интерфейс</p>
        </div>
        <div className="feature-card">
          <h3>🔧 Простота разработки</h3>
          <p>Четкое разделение фронтенда и бэкенда упрощает поддержку и масштабирование</p>
        </div>
      </div>
    </div>
  );
};

export default Home;