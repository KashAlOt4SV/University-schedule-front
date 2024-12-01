// AdminUsersPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const AdminUsersPage = () => {
  const [fio, setFio] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post('/api/users', { fio, role });
      alert('Пользователь успешно создан');
      setFio('');
      setRole('');
    } catch (error) {
      alert('Ошибка при создании пользователя');
    }
  };

  return (
    <Container>
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
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit}>Создать пользователя</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminUsersPage;
