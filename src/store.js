// Импортируем необходимые функции и библиотеки
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk'; // Импортируем thunk middleware
import rootReducer from './reducers'; // Импортируем корневой редьюсер

// Создаем Redux хранилище, комбинируя редюсеры
const store = createStore(rootReducer, applyMiddleware(thunk));


export default store; // Экспортируем хранилище