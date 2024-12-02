import React, { useState, useEffect } from 'react';
import ScheduleTable from '../components/ScheduleTable';
import axios from 'axios';
import { Container, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ProtectedRoute from '../components/ProtectedRoute'; 
import { useSelector } from 'react-redux';
import getUserRole from '../components/jwt_decode';

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [groups, setGroups] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [classTypes, setClassTypes] = useState([]);
  const [group, setGroup] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [classType, setClassType] = useState('');

  // Извлекаем данные пользователя из состояния auth
  const auth = useSelector((state) => state.auth); 
  const user = auth ? auth.user : null; // Защита от ошибки, если state.auth еще не загружен
  const [userRole, setRole] = useState(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  // Загрузка расписания и данных для выбора группы, дисциплины и типа занятия
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/schedule', {
      headers: {
        Authorization: `Bearer ${token}` // Отправляем токен в заголовке
      }
    })
      .then(response => {
        setSchedule(response.data);
      })
      .catch(error => {
        console.error("Error fetching schedule", error);
      });

    // Загрузка групп
    axios.get('http://localhost:5000/api/groups', {
      headers: {
        Authorization: `Bearer ${token}` // Отправляем токен в заголовке
      }
    })
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error("Error fetching groups", error);
      });

    // Загрузка дисциплин
    axios.get('http://localhost:5000/api/disciplines', {
      headers: {
        Authorization: `Bearer ${token}` // Отправляем токен в заголовке
      }
    })
      .then(response => {
        setDisciplines(response.data);
      })
      .catch(error => {
        console.error("Error fetching disciplines", error);
      });
    
    // Загрузка типов занятий
    axios.get('http://localhost:5000/api/disciplines', {
      headers: {
        Authorization: `Bearer ${token}` // Отправляем токен в заголовке
      }
    })
      .then(response => {
        setClassTypes(response.data);
      })
      .catch(error => {
        console.error("Error fetching class types", error);
      });

  }, []);

  const handleCellClick = (day, time) => {
    setSelectedCell({ day, time });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Логика сохранения изменений расписания
    const token = localStorage.getItem('token');
    axios.post('http://localhost:5000/api/schedule', {
      day: selectedCell.day,
      time: selectedCell.time,
      groupId: group,
      disciplineId: discipline,
      classType: classType
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setSchedule([...schedule, response.data]); // Добавляем новое расписание в состояние
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error saving schedule', error);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Container>
      <h2>Расписание</h2>
      <ScheduleTable schedule={schedule} onCellClick={handleCellClick} />
      <ProtectedRoute requiredRole={userRole === "dispatcher" ? "dispatcher" : "admin"}>
      {isEditing && (
          <div>
            <h3>Редактирование пары</h3>
            <p>День: {selectedCell.day}, Время: {selectedCell.time}</p>

            <FormControl fullWidth>
              <InputLabel>Группа</InputLabel>
              <Select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Дисциплина</InputLabel>
              <Select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
              >
                {disciplines.map((discipline) => (
                  <MenuItem key={discipline.id} value={discipline.id}>{discipline.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Тип занятия</InputLabel>
              <Select
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
              >
                {classTypes.map((classType) => (
                  <MenuItem key={classType.id} value={classType.id}>{classType.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button onClick={handleSave} variant="contained" color="primary">Сохранить</Button>
            <Button onClick={handleCancel} variant="contained" color="secondary">Отменить</Button>
          </div>
      )}

      </ProtectedRoute>
      
    </Container>
  );
};

export default SchedulePage;
