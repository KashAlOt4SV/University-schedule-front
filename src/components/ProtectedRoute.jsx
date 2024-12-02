// components/ProtectedRoute.jsx
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
        setRole(response.data.role);
        setLoading(false);
        console.log("admin")
      })
      .catch((err) => {
        setRole(null);
        setLoading(false);
        console.log(err)
      });
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (role !== requiredRole) {
    return <div>У вас нет доступа к этой странице</div>;
  }

  return children;
};

export default ProtectedRoute;
