import React, { useEffect, useState } from 'react';
import { getSchedules } from '../../services/scheduleService';
import { Typography, Container, List, ListItem, ListItemText } from '@mui/material';

// Компонент для отображения списка расписаний
const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);

  // Загружаем расписания при монтировании компонента
  useEffect(() => {
    const fetchSchedules = async () => {
      const data = await getSchedules();
      setSchedules(data);
    };
    fetchSchedules();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Расписание</Typography>
      <List>
        {schedules.map((schedule) => (
          <ListItem key={schedule.id}>
            <ListItemText
              primary={`${schedule.groupName} - ${schedule.subject} с ${schedule.teacher}`}
              secondary={`${schedule.dayOfWeek} | ${schedule.timeSlot}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ScheduleList;
