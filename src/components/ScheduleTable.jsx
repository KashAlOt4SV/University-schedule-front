import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';
import axios from 'axios';

const ScheduleTable = ({ onCellClick }) => {
  const [schedule, setSchedule] = useState([]);

  // Массив для отображения полного времени для каждой пары
  const timeSlots = [
    { time: '08:30 - 09:50', pair: 1 },
    { time: '10:05 - 11:25', pair: 2 },
    { time: '11:40 - 13:00', pair: 3 },
    { time: '13:45 - 15:05', pair: 4 },
    { time: '15:20 - 16:40', pair: 5 },
    { time: '16:55 - 18:15', pair: 6 },
    { time: '18:30 - 19:50', pair: 7 },
    { time: '20:05 - 21:25', pair: 8 },
  ];

  // Полные дни недели
  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  // Загружаем данные с бэкенда и преобразуем их в нужный формат
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/schedule', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const formattedSchedule = formatSchedule(response.data);
        setSchedule(formattedSchedule);
      })
      .catch((error) => {
        console.error('Error fetching schedule', error);
      });
  }, []);

  // Преобразуем данные из бэкенда в нужный формат (массив массивов)
  const formatSchedule = (data) => {
    const schedule = timeSlots.map((timeSlot, index) => {
      return daysOfWeek.map((day) => {
        // Преобразуем день недели на русском в английский (если нужно)
        const dayOfWeekEng = {
          'Понедельник': 'Monday',
          'Вторник': 'Tuesday',
          'Среда': 'Wednesday',
          'Четверг': 'Thursday',
          'Пятница': 'Friday',
          'Суббота': 'Saturday',
        }[day];
  
        // Ищем занятие для конкретного дня и пары
        const entry = data.find(
          (item) => item.dayOfWeek === dayOfWeekEng && item.timeSlot === (index + 1).toString()
        );
  
        console.log('Entry found for', day, timeSlot.pair, entry);  // Логируем результат поиска
  
        return entry
          ? {
              subject: entry.Discipline?.name || 'Не указана',  // Дисциплина
              teacher: entry.Teacher?.FIO || 'Не указан',        // Преподаватель
              group: entry.Group?.groupName || 'Не указана',      // Группа
              day,
              time: timeSlot.time,
            }
          : { subject: 'Нет занятия', teacher: 'Не указан', group: 'Не указана', day, time: timeSlot.time };
      });
    });

    return schedule;
  };
  

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Пара</TableCell>
          {daysOfWeek.map((day, index) => (
            <TableCell key={index}>{day}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {schedule.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {/* Номер пары и время */}
            <TableCell>
              {timeSlots[rowIndex].pair + " Пара"}
              <br />
              <strong>{timeSlots[rowIndex].time}</strong>
            </TableCell>
            {row.map((cell, colIndex) => (
              <TableCell
                key={colIndex}
                onClick={() => onCellClick(cell.day, cell.time)} // При клике на ячейку, передаем день и время
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <strong>Дисциплина:</strong> {cell.subject || 'Нет занятия'}
                </div>
                <div>
                  <strong>Преподаватель:</strong> {cell.teacher || 'Не указан'}
                </div>
                <div>
                  <strong>Группа:</strong> {cell.group || 'Не указана'}
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ScheduleTable;
