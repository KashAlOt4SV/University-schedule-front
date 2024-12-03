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
  const [teachers, setTeachers] = useState([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);
  const [allDisciplines, setAllDisciplines] = useState([]);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherName, setTeacherName] = useState(''); // Для редактирования ФИО
  const [openSnackbar, setOpenSnackbar] = useState(false); // Для Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const token = localStorage.getItem('token');
  const [userRole, setRole] = useState(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  useEffect(() => {
    // Получаем список преподавателей
    axios.get('http://localhost:5000/api/teachers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error("Error fetching teachers:", error);
      });

    // Получаем список всех дисциплин
    axios.get('http://localhost:5000/api/disciplines', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setAllDisciplines(response.data);
      })
      .catch(error => {
        console.error("Error fetching disciplines:", error);
      });
  }, [token]);

  const handleEditTeacher = (id) => {
    const teacher = teachers.find(t => t.id === id);
    setTeacherName(teacher.FIO);  // Устанавливаем текущее ФИО для редактирования

    // Преобразуем строку дисциплин в массив и устанавливаем для редактирования
    setSelectedDisciplines(teacher.Disciplines ? teacher.Disciplines.split(', ') : []);
    setEditingTeacherId(id);  // Устанавливаем ID редактируемого преподавателя
  };

  const handleSaveTeacher = () => {
    if (selectedDisciplines.length === 0) {
      setSnackbarMessage('Пожалуйста, выберите хотя бы одну дисциплину!');
      setSnackbarType('error');
      setOpenSnackbar(true);
      return;
    }

    // Отправляем обновленные данные на сервер, дисциплины в виде строки
    axios.put(`http://localhost:5000/api/teachers/${editingTeacherId}`, {
      fio: teacherName,  // Обновленное ФИО
      disciplines: selectedDisciplines.join(', ')  // Обновленные дисциплины как строка
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
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
                  {teacher.Disciplines && teacher.Disciplines.length > 0
                    ? teacher.Disciplines.split(', ').join(', ')  // Отображаем дисциплины как строку
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
                          onChange={(e) => setSelectedDisciplines(e.target.value)}
                          renderValue={(selected) => selected.join(', ')}
                        >
                          {allDisciplines.map((discipline) => (
                            <MenuItem key={discipline.id} value={discipline.name}>
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
