// Импортируем необходимые функции и библиотеки
import { createStore, combineReducers } from 'redux';
import rootReducer from './reducers'; // Импортируем корневой редюсер

// Создаем Redux хранилище, комбинируя редюсеры
const store = createStore(rootReducer);

export default store; // Экспортируем хранилище