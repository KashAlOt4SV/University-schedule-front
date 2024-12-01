import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Container } from '@mui/material';

const TeacherPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [discipline, setDiscipline] = useState('');

  useEffect(() => {
    axios.get('/api/teachers')
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error("Error fetching teachers", error);
      });
  }, []);

  const handleAddTeacher = () => {
    axios.post('/api/teachers', { name: teacherName, discipline })
      .then(response => {
        setTeachers([...teachers, response.data]);
        setTeacherName('');
        setDiscipline('');
      })
      .catch(error => {
        console.error("Error adding teacher", error);
      });
  };

  return (
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
  );
};

export default TeacherPage;