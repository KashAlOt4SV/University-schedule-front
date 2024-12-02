import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel, Button, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';

const EditTeacher = () => {
  const [teacher, setTeacher] = useState(null);
  const [fio, setFio] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const { teacherId } = useParams();

  useEffect(() => {
    // Получаем список всех дисциплин
    axios.get('http://localhost:5000/api/disciplines')
      .then(response => {
        setDisciplines(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении дисциплин', error);
      });

    // Получаем данные преподавателя
    axios.get(`http://localhost:5000/api/teachers/${teacherId}`)
      .then(response => {
        const teacherData = response.data;
        setTeacher(teacherData);
        setFio(teacherData.FIO);
        setEmail(teacherData.email);
        setSelectedDisciplines(teacherData.Disciplines.map(discipline => discipline.name));
      })
      .catch(error => {
        console.error('Ошибка при получении преподавателя', error);
      });
  }, [teacherId]);

  const handleSubmit = async () => {
    const payload = { fio, email, disciplines: selectedDisciplines };
    try {
      await axios.put(`http://localhost:5000/api/teachers/${teacherId}`, payload);
      alert('Преподаватель обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении преподавателя', error);
      alert('Ошибка при обновлении преподавателя');
    }
  };

  return (
    <div>
      {teacher && (
        <div>
          <h2>Редактирование преподавателя: {teacher.FIO}</h2>
          <TextField label="ФИО" value={fio} onChange={(e) => setFio(e.target.value)} fullWidth />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Дисциплины</InputLabel>
            <Select
              multiple
              value={selectedDisciplines}
              onChange={(e) => setSelectedDisciplines(e.target.value)}
              label="Дисциплины"
            >
              {disciplines.map((discipline) => (
                <MenuItem key={discipline.id} value={discipline.name}>
                  {discipline.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleSubmit} variant="contained">Обновить</Button>
        </div>
      )}
    </div>
  );
};

export default EditTeacher;
