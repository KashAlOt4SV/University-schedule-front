// AcademicGroupsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, TextField, Grid, Table, TableBody, TableCell, TableRow, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ProtectedRoute from '../components/ProtectedRoute'; 
import getUserRole from '../components/jwt_decode';

const AcademicGroupsPage = () => {
  const [groupName, setGroupName] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Загрузим группы и студентов из базы данных
    axios.get('http://localhost:5000/api/groups', {
      headers: {
        Authorization: `Bearer ${token}` // Отправляем токен в заголовке
      }
    })
      .then(response => {
        setGroupList(response.data);
      })
      .catch(error => {
        console.error("Ошибка при загрузке групп:", error);
      });
  

    axios.get('http://localhost:5000/api/students', {
      headers: {
        Authorization: `Bearer ${token}` // Отправляем токен в заголовке
      }
    })
      .then(response => {
        setStudentsList(response.data);
      })
      .catch(error => {
        console.error("Ошибка при загрузке студентов:", error);
      });
  }, []);

  const [user_role, setRole] = useState(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  const handleGroupSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/groups', { name: groupName }, {
        headers: {
          Authorization: `Bearer ${token}` // Отправляем токен в заголовке
        }
      });
      alert('Группа успешно добавлена');
      setGroupName('');
      // Перезагружаем список групп
      const response = await axios.get('http://localhost:5000/api/groups');
      setGroupList(response.data);
    } catch (error) {
      alert('Ошибка при добавлении группы');
    }
  };

  const handleAddStudentToGroup = async (groupId) => {
    try {
      await axios.post(`http://localhost:5000/api/groups/${groupId}/students`, { studentId: selectedStudent }, {
        headers: {
          Authorization: `Bearer ${token}` // Отправляем токен в заголовке
        }
      });
      alert('Студент добавлен в группу');
      // Перезагружаем список студентов для группы
      const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/students`, {
        headers: {
          Authorization: `Bearer ${token}` // Отправляем токен в заголовке
        }
      });
      setStudents(response.data);
    } catch (error) {
      alert('Ошибка при добавлении студента в группу');
    }
  };

  const handleRemoveStudentFromGroup = async (groupId, studentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Отправляем токен в заголовке
        }
      });
      alert('Студент удален из группы');
      // Перезагружаем список студентов для группы
      const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/students`, {
        headers: {
          Authorization: `Bearer ${token}` // Отправляем токен в заголовке
        }
      });
      setStudents(response.data);
    } catch (error) {
      alert('Ошибка при удалении студента из группы');
    }
  };


  return (
    <ProtectedRoute requiredRole={"academicResponsible" ? user_role:"admin"}>
        <Container>
      <h2>Управление группами</h2>
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

      <h3>Список групп</h3>
      <Table>
        <TableBody>
          {groupList.map((group) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <InputLabel>Студент</InputLabel>
                  <Select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    {studentsList.map((student) => (
                      <MenuItem key={student.id} value={student.id}>{student.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <Button variant="contained" onClick={() => handleAddStudentToGroup(group.id)}>Добавить студента</Button>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => setStudents([])}>Удалить группу</Button>
              </TableCell>
              <TableCell>
                <Table>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
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
