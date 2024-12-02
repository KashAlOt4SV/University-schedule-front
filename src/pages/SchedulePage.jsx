import React, { useState, useEffect} from 'react';
import ScheduleTable from '../components/ScheduleTable';
import axios from 'axios';
import { Container, Button } from '@mui/material';
import ProtectedRoute from '../components/ProtectedRoute'; 
import { useSelector } from 'react-redux';
import getUserRole from '../components/jwt_decode';

const SchedulePage = ({ userRole }) => {
  const [schedule, setSchedule] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  // Извлекаем данные пользователя из состояния auth
  const auth = useSelector((state) => state.auth); 
  const user = auth ? auth.user : null; // Защита от ошибки, если state.auth еще не загружен
  const [user_role, setRole] = useState(null);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);


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
  }, []);

  const handleCellClick = (day, time) => {
    setSelectedCell({ day, time });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Логика сохранения изменений расписания
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Container>
      <h2>Расписание</h2>
      <ScheduleTable schedule={schedule} onCellClick={handleCellClick} />
      
      {isEditing && (
        <ProtectedRoute requiredRole={user?.role === "dispatcher" ? "dispatcher" : "admin"}>
          <div>
            <h3>Редактирование пары</h3>
            <p>День: {selectedCell.day}, Время: {selectedCell.time}</p>
            {/* Форма для выбора дисциплины, группы и типа занятия */}
            <Button onClick={handleSave} variant="contained" color="primary">Сохранить</Button>
            <Button onClick={handleCancel} variant="contained" color="secondary">Отменить</Button>
          </div>
        </ProtectedRoute>
      )}
    </Container>
  );
};

export default SchedulePage;
