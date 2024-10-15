import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { AuthContext } from '../../context/AuthContext.jsx';
import { login } from '../../services/AuthService.jsx';

// Компонент для авторизации
const Login = () => {
  const { login: loginUser } = useContext(AuthContext); // Получаем контекст авторизации
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      loginUser(data.token); // Сохраняем токен в контексте
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Вход</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Пароль"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Войти
        </Button>
      </form>
    </Container>
  );
};

export default Login;
