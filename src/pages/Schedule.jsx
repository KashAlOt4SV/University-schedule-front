// Импортируем React
import React from 'react';
import { useSelector } from 'react-redux'; // Импортируем хук для получения данных из Redux

// Компонент для отображения расписания
const Schedule = () => {
  const schedule = useSelector((state) => state.schedule.schedule); // Получаем расписание из хранилища Redux

  return (
    <div>
      <h1>Расписание</h1>
      {schedule.length > 0 ? (
        <ul>
          {schedule.map((item, index) => (
            <li key={index}>{item}</li> // Выводим каждое занятие расписания
          ))}
        </ul>
      ) : (
        <p>Расписание еще не загружено.</p> // Сообщение, если расписание пустое
      )}
    </div>
  );
};

export default Schedule; // Экспортируем компонент
