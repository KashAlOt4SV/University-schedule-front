// DisciplinesPage.jsx
import React, { useStatem, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ProtectedRoute from '../components/ProtectedRoute'; 
import getUserRole from '../components/jwt_decode';

const DisciplinesPage = () => {
  const [disciplineName, setDisciplineName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState(["Практическое занятие", "Лекция", "Лабораторная работа"]);
  const token = localStorage.getItem('token');

  const [user_role, setRole] = useState(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  const handleDisciplineSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/disciplines', { name: disciplineName }, {
        headers: {
          Authorization: `Bearer ${token}` // Отправляем токен в заголовке
        }
      });
      alert('Дисциплина успешно добавлена');
      setDisciplineName('');
    } catch (error) {
      alert('Ошибка при добавлении дисциплины');
    }
  };

  const handleTypeSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/discipline-types', { disciplineName, type: selectedType }, {
        headers: {
          Authorization: `Bearer ${token}` // Отправляем токен в заголовке
        }
      });
      alert('Тип занятия успешно добавлен для дисциплины');
      setSelectedType('');
    } catch (error) {
      alert('Ошибка при добавлении типа занятия');
    }
  };
  return (
    <ProtectedRoute requiredRole={"academicResponsible" ? user_role:"admin"}>
      <Container>
      <h2>Составление списка дисциплин</h2>
      <TextField
        label="Название дисциплины"
        value={disciplineName}
        onChange={(e) => setDisciplineName(e.target.value)}
      />
      <Button variant="contained" onClick={handleDisciplineSubmit}>Добавить дисциплину</Button>

      <h3>Определение видов занятий</h3>
      <FormControl fullWidth>
        <InputLabel>Тип занятия</InputLabel>
        <Select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {types.map((type, index) => (
            <MenuItem key={index} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleTypeSubmit}>Добавить тип занятия</Button>
    </Container>
    </ProtectedRoute>
  );
};

export default DisciplinesPage;
