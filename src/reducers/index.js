// Импортируем combineReducers для объединения редюсеров
import { combineReducers } from 'redux';
import scheduleReducer from './scheduleReducer'; // Редюсер для расписания

// Комбинируем все редюсеры в один
const rootReducer = combineReducers({
  schedule: scheduleReducer, // Добавляем редюсер расписания в хранилище
});

export default rootReducer; // Экспортируем корневой редюсер