// LoginPage.jsx
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); // Сохраняем токен в localStorage
      const role = response.data.role;
  
      // Редирект в зависимости от роли
      if (role === 'admin') {
        history.push('/admin');
      } else if (role === 'dispatcher') {
        history.push('/dispatcher');
      } else if (role === 'academic_responsible') {
        history.push('/academic-responsible');
      } else {
        history.push('/lecturer');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('Неверный логин или пароль');
      } else if (error.response && error.response.status === 500) {
        setErrorMessage('Ошибка сервера: 500');
      } else {setErrorMessage("Вы успешно авторизированы!")}
    }
  };

  return (
    <Container>
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
    </Container>
  );
};

export default LoginPage;
