import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Container } from '@mui/material'; 
import ProtectedRoute from '../components/ProtectedRoute'; 
import getUserRole from '../components/jwt_decode';

const TeacherPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [discipline, setDiscipline] = useState('');
  const token = localStorage.getItem('token');
  const [userRole, setRole] = useState(null);


  useEffect(() => {
    axios.get('http://localhost:5000/api/teachers', {
      headers: {
        Authorization: `Bearer ${token}` // Отправляем токен в заголовке
      }
    })
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error("Error fetching teachers", error);
      });
  }, []);

  const handleAddTeacher = () => {
    axios.post('http://localhost:5000/api/teachers', {
      headers: {
        Authorization: `Bearer ${token}` // Отправляем токен в заголовке
      }
    }, { name: teacherName, discipline })
      .then(response => {
        setTeachers([...teachers, response.data]);
        setTeacherName('');
        setDiscipline('');
      })
      .catch(error => {
        console.error("Error adding teacher", error);
      });
  };
  
  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  return (
    <ProtectedRoute requiredRole={userRole === "departmentResponsible" ? "departmentResponsible" :"admin"}>
    <Container>
      <h2>Преподаватели</h2>
      <TextField
        label="Имя преподавателя"
        value={teacherName}
        onChange={(e) => setTeacherName(e.target.value)}
      />
      <TextField
        label="Дисциплина"
        value={discipline}
        onChange={(e) => setDiscipline(e.target.value)}
      />
      <Button onClick={handleAddTeacher} variant="contained" color="primary">
        Добавить
      </Button>
      <ul>
        {teachers.map((teacher) => (
          <li key={teacher.id}>{teacher.name} - {teacher.discipline}</li>
        ))}
      </ul>
    </Container>
    </ProtectedRoute>
  );
};

export default TeacherPage;