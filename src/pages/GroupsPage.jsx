import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, TextField, Grid, Table, TableBody, TableCell, TableRow, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import ProtectedRoute from '../components/ProtectedRoute';
import getUserRole from '../components/jwt_decode';

const AcademicGroupsPage = () => {
  const [groupName, setGroupName] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [groupList, setGroupList] = useState([]);  // Список групп
  const [studentsList, setStudentsList] = useState([]);  // Список студентов
  const [students, setStudents] = useState([]);  // Студенты в выбранной группе
  const [userRole, setRole] = useState(null);  // Роль пользователя
  const token = localStorage.getItem('token');

  // Получение роли пользователя
  useEffect(() => {
    const userRole = getUserRole();  // Получаем роль пользователя из JWT
    setRole(userRole);
  }, []);

  // Загружаем данные с бэкенда
  useEffect(() => {
    // Загружаем группы из БД
    axios.get('http://localhost:5000/api/groups', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('Groups:', response.data);  // Логируем группы для отладки
        setGroupList(response.data);
      })
      .catch(error => {
        console.error("Ошибка при загрузке групп:", error);
      });

    // Загружаем студентов из БД
    axios.get('http://localhost:5000/api/students', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('Students:', response.data);  // Логируем студентов для отладки
        setStudentsList(response.data);
      })
      .catch(error => {
        console.error("Ошибка при загрузке студентов:", error);
      });
  }, [token]);

  // Создание группы
  const handleGroupSubmit = async () => {
    if (!groupName) {
      alert('Пожалуйста, введите название группы');
      return;
    }

    console.log('Creating group with name:', groupName);  // Логируем название группы

    try {
      await axios.post('http://localhost:5000/api/groups', { groupName: groupName }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Группа успешно добавлена');
      setGroupName('');
      // Перезагружаем список групп
      const response = await axios.get('http://localhost:5000/api/groups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroupList(response.data);
    } catch (error) {
      console.error('Ошибка при добавлении группы:', error);  // Логируем ошибку
      alert('Ошибка при добавлении группы');
    }
  };

  // Добавление студента в группу
  const handleAddStudentToGroup = async (groupId) => {
    if (!selectedStudent) {
      alert('Пожалуйста, выберите студента');
      return;
    }

    console.log(`Adding student with ID ${selectedStudent} to group with ID ${groupId}`);  // Логируем передаваемые данные

    try {
      await axios.post(`http://localhost:5000/api/groups/${groupId}/students/${selectedStudent}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Студент добавлен в группу');
      const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data);
    } catch (error) {
      alert('Ошибка при добавлении студента в группу');
      console.error('Error adding student to group:', error);
    }
  };

  // Удаление студента из группы
  const handleRemoveStudentFromGroup = async (groupId, studentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Студент удален из группы');
      const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data);
    } catch (error) {
      alert('Ошибка при удалении студента из группы');
      console.error('Error removing student from group:', error);
    }
  };

  // Удаление группы
  const handleRemoveGroup = async (groupId) => {
    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Группа удалена');
      // Перезагружаем список групп
      const response = await axios.get('http://localhost:5000/api/groups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroupList(response.data);
    } catch (error) {
      alert('Ошибка при удалении группы');
    }
  };

  // Редактирование группы
  const handleEditGroup = async (groupId, newGroupName) => {
    try {
      await axios.put(`http://localhost:5000/api/groups/${groupId}`, { groupName: newGroupName }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Группа отредактирована');
      // Перезагружаем список групп
      const response = await axios.get('http://localhost:5000/api/groups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroupList(response.data);
    } catch (error) {
      alert('Ошибка при редактировании группы');
    }
  };

  return (
    <ProtectedRoute requiredRole={userRole === "academicResponsible" ? "academicResponsible" : "admin"}>
      <Container>
        <Typography variant="h4" gutterBottom>Управление группами</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Название группы"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleGroupSubmit}>Добавить группу</Button>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom>Список групп</Typography>
        <Table>
          <TableBody>
            {groupList.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.groupName}</TableCell>  {/* Название группы */}
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEditGroup(group.id, prompt('Введите новое название группы', group.groupName))}>Редактировать</Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleRemoveGroup(group.id)}>Удалить группу</Button>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Студент</InputLabel>
                    <Select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}  // Обработчик изменения
                    >
                      {studentsList.length > 0 ? (
                        studentsList.map((student) => (
                          <MenuItem key={student.id} value={student.id}>{student.FIO}</MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Нет студентов</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleAddStudentToGroup(group.id)}>Добавить студента</Button>
                </TableCell>
                <TableCell>
                  <Table>
                    <TableBody>
                      {group.Students?.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.FIO}</TableCell> {/* ФИО студента */}
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => handleRemoveStudentFromGroup(group.id, student.id)}
                            >
                              Удалить
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </ProtectedRoute>
  );
};

export default AcademicGroupsPage;
