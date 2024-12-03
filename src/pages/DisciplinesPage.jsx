import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

import ProtectedRoute from '../components/ProtectedRoute';
import getUserRole from '../components/jwt_decode';

const DisciplinesPage = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [classTypes, setClassTypes] = useState(['Лекция', 'Практическое занятие', 'Лабораторная работа']);
  const [selectedClassTypes, setSelectedClassTypes] = useState([]);  // Это должно быть состояние для выбранных типов
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userRole, setRole] = useState(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);


  // Загружаем дисциплины при монтировании компонента
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/disciplines', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setDisciplines(response.data);
    })
    .catch((error) => {
      console.error('Error fetching disciplines', error);
    });
  }, []);

  // Обработчик для добавления новой дисциплины
  const handleAddDiscipline = () => {
    const token = localStorage.getItem('token');
    axios.post('http://localhost:5000/api/disciplines', {
      name,
      classTypes: selectedClassTypes,
      description
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setDisciplines([...disciplines, response.data]);
      setSnackbarMessage('Дисциплина успешно добавлена');
      setSnackbarType('success');
      setOpenSnackbar(true);
      setDialogOpen(false);
      resetForm();  // Сбросим форму после добавления
    })
    .catch((error) => {
      setSnackbarMessage('Ошибка при добавлении дисциплины');
      setSnackbarType('error');
      setOpenSnackbar(true);
      console.error('Error adding discipline', error);
    });
  };

  // Обработчик для редактирования дисциплины
  const handleEditDiscipline = () => {
    const token = localStorage.getItem('token');
    axios.put(`http://localhost:5000/api/disciplines/${selectedDiscipline.id}`, {
      name,
      classTypes: selectedClassTypes,
      description
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const updatedDisciplines = disciplines.map(discipline =>
        discipline.id === selectedDiscipline.id ? response.data : discipline
      );
      setDisciplines(updatedDisciplines);
      setSnackbarMessage('Дисциплина успешно обновлена');
      setSnackbarType('success');
      setOpenSnackbar(true);
      setDialogOpen(false);
      resetForm();  // Сбросим форму после редактирования
    })
    .catch((error) => {
      setSnackbarMessage('Ошибка при редактировании дисциплины');
      setSnackbarType('error');
      setOpenSnackbar(true);
      console.error('Error updating discipline', error);
    });
  };

  // Обработчик для открытия диалога редактирования
  const handleEditDialogOpen = (discipline) => {
    setSelectedDiscipline(discipline);
    setName(discipline.name);
    setDescription(discipline.description || '');
    setSelectedClassTypes(discipline.classTypes || []);  // Инициализируем выбранные типы
    setDialogOpen(true);
  };

  // Обработчик для удаления дисциплины
  const handleDeleteDiscipline = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5000/api/disciplines/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setDisciplines(disciplines.filter(discipline => discipline.id !== id));
      setSnackbarMessage('Дисциплина удалена');
      setSnackbarType('success');
      setOpenSnackbar(true);
    })
    .catch((error) => {
      setSnackbarMessage('Ошибка при удалении дисциплины');
      setSnackbarType('error');
      setOpenSnackbar(true);
      console.error('Error deleting discipline', error);
    });
  };

  // Сбросить форму
  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedClassTypes([]);
    setSelectedDiscipline(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  return (
    <Container>
      <ProtectedRoute requiredRole={userRole === "academicResponsible" ? "academicResponsible" : "admin"}>
      <h2>Дисциплины</h2>
      <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
        Добавить дисциплину
      </Button>

      {/* Список дисциплин */}
      <div>
        {disciplines.map((discipline) => (
          <div key={discipline.id}>
            <h3>{discipline.name}</h3>
            <p>{discipline.description || 'Описание не указано'}</p>
            <p>Типы занятий: {discipline.classTypes.join(', ')}</p>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleEditDialogOpen(discipline)}
            >
              Редактировать
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleDeleteDiscipline(discipline.id)}
              style={{ marginLeft: '10px' }}
            >
              Удалить
            </Button>
          </div>
        ))}
      </div>

      {/* Snackbar уведомления */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        severity={snackbarType}
      />

      {/* Диалоговое окно для добавления/редактирования дисциплины */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{selectedDiscipline ? 'Редактировать дисциплину' : 'Добавить дисциплину'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Название дисциплины"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            style={{ marginBottom: '7px' }}
          />
          <TextField
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            style={{ marginBottom: '7px' }}
          />

          <FormControl fullWidth>
            <InputLabel>Типы занятий</InputLabel>
            <Select
              multiple
              value={selectedClassTypes}
              onChange={(e) => setSelectedClassTypes(e.target.value)}
              displayEmpty
              style={{ marginBottom: '7px' }}
              renderValue={(selected) => selected.join(', ')}
            >
              {classTypes.map((type, index) => (
                <MenuItem key={index} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Отменить</Button>
          <Button
            onClick={selectedDiscipline ? handleEditDiscipline : handleAddDiscipline}
            color="primary"
          >
            {selectedDiscipline ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
      </ProtectedRoute>
    </Container>
  );
};

export default DisciplinesPage;
