// Login.jsx
import React, { useState } from 'react';
import AuthService from '../services/authService';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.login(credentials);
      // Перенаправляем на страницу расписания после успешного входа
      window.location.href = '/schedule';
    } catch (error) {
      console.error('Ошибка при авторизации', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button type="submit">Войти</button>
    </form>
  );
};

export default Login;
