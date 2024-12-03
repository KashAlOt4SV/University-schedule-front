import React, { useState, useEffect } from 'react';
import { Container, Button, MenuItem, Select, InputLabel, FormControl, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import ScheduleTable from '../components/ScheduleTable';
import ProtectedRoute from '../components/ProtectedRoute';
import { useSelector } from 'react-redux';
import getUserRole from '../components/jwt_decode';

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);  // Сохраняем выбранные день и время
  const [groups, setGroups] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [classTypes, setClassTypes] = useState(['Лекция', 'Практическое занятие', 'Лабораторная работа']);
  const [teachers, setTeachers] = useState([]);
  
  // Состояния для выбранной группы, преподавателя, дисциплины
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClassType, setSelectedClassType] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);  // Для открытия/закрытия диалога

  // Состояния для Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success'); // success | error

  const auth = useSelector((state) => state.auth);
  const user = auth ? auth.user : null;
  const [userRole, setRole] = useState(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/schedule', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setSchedule(response.data);
      })
      .catch(error => {
        console.error('Error fetching schedule', error);
      });

    axios.get('http://localhost:5000/api/groups', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error('Error fetching groups', error);
      });

    axios.get('http://localhost:5000/api/disciplines', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setDisciplines(response.data);
      })
      .catch(error => {
        console.error('Error fetching disciplines', error);
      });

    axios.get('http://localhost:5000/api/teachers', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error('Error fetching teachers', error);
      });
  }, []);

  const handleCellClick = (day, time, existingSchedule) => {
    setSelectedCell({ day, time });
    if (existingSchedule) {
      // Если расписание уже существует, выбираем его для редактирования
      setSelectedGroup(existingSchedule.Group.id);
      setSelectedDiscipline(existingSchedule.Discipline.id);
      setSelectedTeacher(existingSchedule.Teacher.id);
      setSelectedClassType(existingSchedule.classType);
    } else {
      // Если новое расписание, сбрасываем все
      setSelectedGroup('');
      setSelectedDiscipline('');
      setSelectedTeacher('');
      setSelectedClassType('');
    }
    setDialogOpen(true);  // Открытие диалога при нажатии на ячейку
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    // Проверяем, что все данные заполнены
    if (!selectedGroup || !selectedDiscipline || !selectedTeacher || !selectedClassType) {
      setSnackbarMessage('Ошибка: все поля должны быть заполнены.');
      setSnackbarType('error');
      setSnackbarOpen(true);
      return;
    }

    // Если мы редактируем, отправляем PUT запрос
    if (selectedCell.id) {
      axios.put(`http://localhost:5000/api/schedule/${selectedCell.id}`, {
        dayOfWeek: selectedCell.day,
        timeSlot: selectedCell.time,
        groupId: selectedGroup,
        disciplineId: selectedDiscipline,
        teacherId: selectedTeacher,
        classType: selectedClassType,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          const updatedSchedule = schedule.map(item =>
            item.id === response.data.id ? response.data : item
          );
          setSchedule(updatedSchedule);
          setDialogOpen(false);  // Закрытие диалога
          setSnackbarMessage('Расписание успешно обновлено!');
          setSnackbarType('success');
          setSnackbarOpen(true);
        })
        .catch(error => {
          console.error('Error updating schedule', error);
          setSnackbarMessage('Ошибка при обновлении расписания.');
          setSnackbarType('error');
          setSnackbarOpen(true);
        });
    } else {
      // Если добавляем новое расписание, отправляем POST запрос
      axios.post('http://localhost:5000/api/schedule', {
        dayOfWeek: selectedCell.day,
        timeSlot: selectedCell.time,
        groupId: selectedGroup,
        disciplineId: selectedDiscipline,
        teacherId: selectedTeacher,
        classType: selectedClassType,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          setSchedule([...schedule, response.data]);
          setDialogOpen(false);  // Закрытие диалога
          setSnackbarMessage('Расписание успешно добавлено!');
          setSnackbarType('success');
          setSnackbarOpen(true);
        })
        .catch(error => {
          console.error('Error saving schedule', error);
          setSnackbarMessage('Ошибка при добавлении расписания.');
          setSnackbarType('error');
          setSnackbarOpen(true);
        });
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);  // Закрытие диалога без сохранения
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);  // Закрытие Snackbar
  };

  return (
    <Container>
      <h2>Расписание</h2>
      <ScheduleTable schedule={schedule} onCellClick={handleCellClick} userRole={userRole} />

      <ProtectedRoute requiredRole={userRole === "dispatcher" ? "dispatcher" : "admin"}>
        <Dialog open={dialogOpen} onClose={handleCancel}>
          <DialogTitle>{selectedCell?.id ? 'Редактировать расписание' : 'Добавить расписание'}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel>Группа</InputLabel>
              <Select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                displayEmpty
                style={{ marginBottom: '7px' }} // Увеличиваем расстояние между строками
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>{group.groupName}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Дисциплина</InputLabel>
              <Select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                displayEmpty
                style={{ marginBottom: '7px' }} // Увеличиваем расстояние между строками
              >
                {disciplines.map((discipline) => (
                  <MenuItem key={discipline.id} value={discipline.id}>{discipline.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Тип занятия</InputLabel>
              <Select
                value={selectedClassType}
                onChange={(e) => setSelectedClassType(e.target.value)}
                displayEmpty
                style={{ marginBottom: '7px' }} // Увеличиваем расстояние между строками
              >
                {classTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Преподаватель</InputLabel>
              <Select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                displayEmpty
                style={{ marginBottom: '7px' }} // Увеличиваем расстояние между строками
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>{teacher.FIO}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">Отменить</Button>
            <Button onClick={handleSave} color="primary">Сохранить</Button>
          </DialogActions>
        </Dialog>
      </ProtectedRoute>

      {/* Snackbar для сообщений */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarType} // 'success' или 'error'
      />
    </Container>
  );
};

export default SchedulePage;
