// Определяем начальное состояние для расписания
const initialState = {
    schedule: [], // Изначально расписание пустое
  };
  
  // Редюсер для обработки действий, связанных с расписанием
  const scheduleReducer = (state = initialState, action) => {
    switch (action.type) {
      // Обработка действия для обновления расписания
      case 'UPDATE_SCHEDULE':
        return {
          ...state, // Сохраняем текущее состояние
          schedule: action.payload, // Обновляем расписание новым значением
        };
      
      // Возвращаем текущее состояние по умолчанию
      default:
        return state;
    }
  };
  
  export default scheduleReducer; // Экспортируем редюсер
  