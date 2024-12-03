import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // useNavigate вместо useHistory
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние для проверки авторизации
  const [userInfo, setUserInfo] = useState(null); // Для хранения информации о пользователе
  const navigate = useNavigate(); // Используем useNavigate

  useEffect(() => {
    // Проверка, есть ли токен в localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Если токен есть, считаем, что пользователь авторизован
      fetchUserInfo(token); // Получаем информацию о пользователе
    }
  }, []);

  // Функция для получения информации о пользователе по токену
  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data); // Сохраняем информацию о пользователе
    } catch (error) {
      console.error('Ошибка при получении информации о пользователе', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); // Сохраняем токен в localStorage
      const role = response.data.role;

      // Редирект в зависимости от роли
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'dispatcher') {
        navigate('/dispatcher');
      } else if (role === 'academic_responsible') {
        navigate('/academic-responsible');
      } else {
        navigate('/lecturer');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('Неверный логин или пароль');
      } else if (error.response && error.response.status === 500) {
        setErrorMessage('Ошибка сервера: 500');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен
    setIsAuthenticated(false); // Обновляем состояние авторизации
    setUserInfo(null); // Очищаем информацию о пользователе
    navigate('/login'); // Перенаправляем на страницу входа
  };

  return (
    <Container>
      {isAuthenticated ? (
        <div>
          <Typography variant="h4" gutterBottom>Вы уже авторизованы</Typography>
          <Typography variant="h6">Добро пожаловать, {userInfo?.fio||"Неназваный гость"}! Твоя роль,{userInfo?.role}!</Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>Выйти</Button>
        </div>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>Вход</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                label="Пароль"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            {errorMessage && (
              <Grid item xs={12}>
                <Typography color="error">{errorMessage}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleLogin}>Войти</Button>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default LoginPage;
