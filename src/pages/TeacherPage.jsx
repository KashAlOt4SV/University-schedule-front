import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Snackbar
} from '@mui/material';
import ProtectedRoute from '../components/ProtectedRoute';
import getUserRole from '../components/jwt_decode';

const TeacherPage = () => {
  const [teachers, setTeachers] = useState([]);  // Список преподавателей
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);  // Выбранные дисциплины для редактирования
  const [allDisciplines, setAllDisciplines] = useState([]);  // Все дисциплины
  const [editingTeacherId, setEditingTeacherId] = useState(null);  // ID редактируемого преподавателя
  const [teacherName, setTeacherName] = useState('');  // ФИО преподавателя
  const [openSnackbar, setOpenSnackbar] = useState(false);  // Открытие уведомлений
  const [snackbarMessage, setSnackbarMessage] = useState('');  // Сообщение уведомления
  const [snackbarType, setSnackbarType] = useState('success');  // Тип уведомления (success, error)
  const token = localStorage.getItem('token');  // Токен пользователя из localStorage
  const [userRole, setRole] = useState(null);  // Роль пользователя

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);  // Устанавливаем роль пользователя
  }, []);

  useEffect(() => {
    // Получаем список преподавателей
    axios.get('http://localhost:5000/api/teachers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        console.log('Received teachers data:', response.data); // Логирование данных
        const teachersWithDisciplines = response.data.map(teacher => ({
          ...teacher,
          Disciplines: Array.isArray(teacher.Disciplines)
            ? teacher.Disciplines
            : teacher.Disciplines ? JSON.parse(teacher.Disciplines) : []  // Преобразуем строку в массив
        }));
        setTeachers(teachersWithDisciplines);
      })
      .catch(error => {
        console.error("Error fetching teachers:", error);
      });

    // Получаем список всех дисциплин
    axios.get('http://localhost:5000/api/disciplines', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setAllDisciplines(response.data);  // Устанавливаем список всех дисциплин
      })
      .catch(error => {
        console.error("Error fetching disciplines:", error);
      });
  }, [token]);

  const handleEditTeacher = (id) => {
    const teacher = teachers.find(t => t.id === id);
    setTeacherName(teacher.FIO);  // Устанавливаем текущее ФИО для редактирования
    setSelectedDisciplines(teacher.Disciplines);  // Устанавливаем выбранные дисциплины
    setEditingTeacherId(id);  // Устанавливаем ID редактируемого преподавателя
  };

  const handleSaveTeacher = () => {
    if (selectedDisciplines.length === 0) {
      setSnackbarMessage('Пожалуйста, выберите хотя бы одну дисциплину!');
      setSnackbarType('error');
      setOpenSnackbar(true);
      return;
    }

    // Отправляем обновленные данные на сервер
    axios.put(`http://localhost:5000/api/teachers/${editingTeacherId}`, {
      fio: teacherName,  // Обновленное ФИО
      disciplines: JSON.stringify(selectedDisciplines)  // Преобразуем массив дисциплин в строку
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Обновляем список преподавателей
        const updatedTeachers = teachers.map(teacher =>
          teacher.id === editingTeacherId ? response.data : teacher
        );
        setTeachers(updatedTeachers);
        setEditingTeacherId(null);
        setSelectedDisciplines([]);
        setTeacherName('');
        setSnackbarMessage('Преподаватель успешно обновлен!');
        setSnackbarType('success');
        setOpenSnackbar(true);
      })
      .catch(error => {
        console.error("Error updating teacher:", error);
        setSnackbarMessage('Ошибка при обновлении преподавателя');
        setSnackbarType('error');
        setOpenSnackbar(true);
      });
  };

  const handleCancelEdit = () => {
    setEditingTeacherId(null);
    setSelectedDisciplines([]);
    setTeacherName('');
  };

  const handleDeleteTeacher = (id) => {
    axios.delete(`http://localhost:5000/api/teachers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        const updatedTeachers = teachers.filter(teacher => teacher.id !== id);
        setTeachers(updatedTeachers);
        setSnackbarMessage('Преподаватель успешно удален');
        setSnackbarType('success');
        setOpenSnackbar(true);
      })
      .catch(error => {
        console.error("Error deleting teacher:", error);
        setSnackbarMessage('Ошибка при удалении преподавателя');
        setSnackbarType('error');
        setOpenSnackbar(true);
      });
  };

  return (
    <ProtectedRoute requiredRole={userRole === "departmentResponsible" ? "departmentResponsible" : "admin"}>
      <Container>
        <h2>Преподаватели</h2>

        {/* Список преподавателей */}
        <Table>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.FIO}</TableCell>
                <TableCell>
                  {/* Проверяем, является ли teacher.Disciplines массивом */}
                  {Array.isArray(teacher.Disciplines) && teacher.Disciplines.length > 0
                    ? teacher.Disciplines.map(id => {
                        const discipline = allDisciplines.find(d => d.id === id);
                        return discipline ? discipline.name : '';
                      }).join(', ') // Если это массив, отображаем через запятую
                    : 'Нет дисциплин'}
                </TableCell>
                <TableCell>
                  {editingTeacherId === teacher.id ? (
                    <>
                      <TextField
                        label="ФИО преподавателя"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}  // Обновление ФИО
                        fullWidth
                      />
                      <FormControl fullWidth>
                        <InputLabel>Дисциплины</InputLabel>
                        <Select
                          multiple
                          value={selectedDisciplines}
                          onChange={(e) => setSelectedDisciplines(e.target.value)}  // Обновление выбранных дисциплин
                          renderValue={(selected) => {
                            return selected.map(id => {
                              const discipline = allDisciplines.find(d => d.id === id);
                              return discipline ? discipline.name : '';
                            }).join(', ');
                          }}
                        >
                          {allDisciplines.map((discipline) => (
                            <MenuItem key={discipline.id} value={discipline.id}>
                              {discipline.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button onClick={handleSaveTeacher} variant="contained" color="primary">
                        Сохранить
                      </Button>
                      <Button onClick={handleCancelEdit} variant="contained" color="secondary">
                        Отмена
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEditTeacher(teacher.id)} variant="contained" color="primary">
                      Редактировать
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    variant="contained"
                    color="secondary"
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Уведомление */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
          severity={snackbarType}
        />
      </Container>
    </ProtectedRoute>
  );
};

export default TeacherPage;
