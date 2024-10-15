import axios from 'axios';

// Получение всех расписаний
export const getSchedules = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/schedule');
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message || 'Ошибка получения расписаний');
  }
};

// Создание нового расписания
export const createSchedule = async (scheduleData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/schedule/create', scheduleData);
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message || 'Ошибка создания расписания');
  }
};
