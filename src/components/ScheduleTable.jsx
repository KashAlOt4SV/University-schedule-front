import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import axios from 'axios';

const ScheduleTable = ({ schedule, onCellClick, userRole }) => {
  const [timeSlots] = useState([
    { time: '08:30 - 09:50', pair: 1 },
    { time: '10:05 - 11:25', pair: 2 },
    { time: '11:40 - 13:00', pair: 3 },
    { time: '13:45 - 15:05', pair: 4 },
    { time: '15:20 - 16:40', pair: 5 },
    { time: '16:55 - 18:15', pair: 6 },
    { time: '18:30 - 19:50', pair: 7 },
    { time: '20:05 - 21:25', pair: 8 },
  ]);

  const [daysOfWeek] = useState([
    'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
  ]);

  // Для редактирования расписания
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [classTypes, setClassTypes] = useState(['Лекция', 'Практическое занятие', 'Лабораторная работа']);

  // Для редактирования или добавления новой ячейки
  const [isEditing, setIsEditing] = useState(false);

  const getCellStyle = (type) => {
    switch (type) {
      case 'subject':
        return { backgroundColor: '#e0f7fa', padding: '10px', textAlign: 'center' };
      case 'teacher':
        return { backgroundColor: '#f1f8e9', padding: '10px', textAlign: 'center' };
      case 'group':
        return { backgroundColor: '#fff3e0', padding: '10px', textAlign: 'center' };
      default:
        return { padding: '10px', textAlign: 'center' };
    }
  };

  // Проверяем, заняты ли преподаватель и группа в выбранной ячейке
  const isSlotOccupied = (day, time, groupId, teacherId, classType) => {
    return schedule.some((entry) => 
      entry.dayOfWeek === day && entry.timeSlot === time && 
      (entry.groupId === groupId || entry.teacherId === teacherId) && entry.classType===classType
    );
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
        {timeSlots.map((timeSlot, rowIndex) => (
          <TableRow key={rowIndex}>
            {/* Номер пары и время */}
            <TableCell>
              {timeSlot.pair + " Пара"}
              <br />
              <strong>{timeSlot.time}</strong>
            </TableCell>
            {daysOfWeek.map((day, colIndex) => {
              const entry = schedule.find(
                (item) => item.dayOfWeek === day && item.timeSlot === timeSlot.time
              );

              return (
                <TableCell
                  key={colIndex}
                  onClick={() => userRole === 'dispatcher' || userRole === 'admin' ? onCellClick(day, timeSlot.time) : null}
                  style={getCellStyle('subject')}
                >
                  {entry ? (
                    <>
                      <div><strong>Дисциплина:</strong> {entry.Discipline?.name + (entry.classType ? " (" + entry.classType + ")" : "") || 'Не указана'}</div>
                      <div><strong>Преподаватель:</strong> {entry.Teacher?.FIO || 'Не указан'}</div>
                      <div><strong>Группа:</strong> {entry.Group?.groupName || 'Не указана'}</div>
                    </>
                  ) : (
                    <div>Нет занятия</div>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ScheduleTable;
