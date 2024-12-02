// CreateUsersPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ProtectedRoute from '../components/ProtectedRoute'; // Импорт правильный

const CreateUsersPage = () => {
  const [fio, setFio] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  axios.defaults.baseURL = process.env.REACT_APP_PROXY;
  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/createUsers', { fio, role, password, email }, {
        headers: {
          Authorization: `Bearer ${token}` // Отправляем токен в заголовке
        }
      });
      alert('Пользователь успешно создан');
      setFio('');
      setRole('');
    } catch (error) {
      alert('Ошибка при создании пользователя');
    }
  };

  return (
    <Container>
      <ProtectedRoute requiredRole="admin"> {/* Убедитесь, что protectedRoute обернут правильно */}
        <h2>Создание нового пользователя</h2>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="ФИО"
              fullWidth
              value={fio}
              onChange={(e) => setFio(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Пароль"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Роль</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="admin">Администратор</MenuItem>
                <MenuItem value="dispatcher">Диспетчер</MenuItem>
                <MenuItem value="academicResponsible">Ответственный за учебную часть</MenuItem>
                <MenuItem value="departmentResponsible">Ответственный за учебную работу на кафедре</MenuItem>
                <MenuItem value="teacher">Преподаватель</MenuItem>
                <MenuItem value="student">Студент</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>Создать пользователя</Button>
          </Grid>
        </Grid>
      </ProtectedRoute>
    </Container>
  );
};

export default CreateUsersPage;
