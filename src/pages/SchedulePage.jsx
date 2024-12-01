import React, { useState, useEffect } from 'react';
import ScheduleTable from '../components/ScheduleTable';
import axios from 'axios';
import { Container, Button } from '@mui/material';

const SchedulePage = ({ userRole }) => {
  const [schedule, setSchedule] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    axios.get('/api/schedule')
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
        <div>
          <h3>Редактирование пары</h3>
          <p>День: {selectedCell.day}, Время: {selectedCell.time}</p>
          {/* Форма для выбора дисциплины, группы и типа занятия */}
          <Button onClick={handleSave} variant="contained" color="primary">Сохранить</Button>
          <Button onClick={handleCancel} variant="contained" color="secondary">Отменить</Button>
        </div>
      )}
    </Container>
  );
};

export default SchedulePage;