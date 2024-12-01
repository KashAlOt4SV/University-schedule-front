// Импортируем необходимые библиотеки и компоненты
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Маршрутизация для React
import Home from './pages/Home'; // Главная страница
import About from './pages/About'; // Страница "О нас"
import Schedule from './pages/SchedulePage'; // Страница с расписанием
import RegisterPage from './pages/RegisterPage'; // Страница "404 - не найдено"
import LoginPage from './pages/LoginPage'; // Страница с расписанием
import NotFound from './pages/NotFound'; // Страница "404 - не найдено"

// Основной компонент приложения App
const App = () => {
  return (
    <div>
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
        <Route path="/register" element={<RegisterPage />} />

        {/* Обработка неизвестных маршрутов (404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
