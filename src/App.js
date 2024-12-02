// Импортируем необходимые библиотеки и компоненты
import {React, useState, useEffect} from 'react';
import { Routes, Route } from 'react-router-dom'; // Маршрутизация для React
import Home from './pages/Home'; // Главная страница
import About from './pages/About'; // Страница "О нас"
import Schedule from './pages/SchedulePage'; // Страница с расписанием
import LoginPage from './pages/LoginPage'; // Страница с расписанием
import NotFound from './pages/NotFound'; // Страница "404 - не найдено"
import Sidebar from './components/Sidebar';
import CreateUsersPage from './pages/CreateUsersPage';
import TeacherPage from './pages/TeacherPage';
import GroupsPage from './pages/GroupsPage'
import DisciplinesPage from './pages/DisciplinesPage';
import { Provider } from 'react-redux';  // Импортируем Provider из react-redux
import store from './store';             // Импортируем ваш store, путь может отличаться

// Основной компонент приложения App
const App = () => {
  // Это значение должно быть взято из состояния пользователя (например, после авторизации)
  const [role, setRole] = useState(''); 

  // Здесь можно добавить код для получения роли пользователя, например, из локального хранилища или контекста
  useEffect(() => {
    // Пример, как можно извлечь роль пользователя
    const userRole = localStorage.getItem('role'); // или из authContext
    if (userRole) {
      setRole(userRole);
    }
  }, []);

  return (
    <div>
      <Provider store={store}>
      <Sidebar/>
      {/* Обработка маршрутов */}
      <Routes>
        {/* Маршрут для главной страницы */}
        <Route path="/" element={<Home />} />

        {/* Маршрут для страницы "О нас" */}
        <Route path="/about" element={<About />} />

        {/* Маршрут для страницы с расписанием */}
        <Route path="/schedule" element={<Schedule />} />

        {/* Маршрут для страницы с расписанием */}
        <Route path="/login" element={<LoginPage />} />

        {/* Маршрут для страницы с расписанием */}
        <Route path="/create-users" element={<CreateUsersPage />} />

        <Route path="/teachers" element={<TeacherPage />} />

        <Route path="/groups" element={<GroupsPage />} />

        <Route path="/disciplines" element={<DisciplinesPage />} />

        {/* Обработка неизвестных маршрутов (404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Provider>
    </div>
  );
};

export default App;
