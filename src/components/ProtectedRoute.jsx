import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем информацию о пользователе
    const token = localStorage.getItem('token');
    if (!token) {
      setRole(null);
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRole(response.data.role);  // Устанавливаем роль
        setLoading(false);
        console.log("Role from server:", response.data.role);  // Логируем роль
      })
      .catch((err) => {
        setRole(null);
        setLoading(false);
        console.log('Error fetching user role:', err);  // Логируем ошибку
      });
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;  // Показываем загрузку, пока не получим роль
  }

  if (!role) {
    return <Navigate to="/login" />;  // Если роль не получена, редиректим на страницу входа
  }

  if (role !== requiredRole) {
    return <div>У вас нет доступа к этой странице</div>;  // Если роль не соответствует, показываем ошибку доступа
  }

  return children;  // Рендерим детей, если роль пользователя соответствует требуемой
};

export default ProtectedRoute;
