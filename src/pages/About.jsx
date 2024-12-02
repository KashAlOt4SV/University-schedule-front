// Импортируем React
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

// Компонент для страницы "О нас"
const About = () => {
  
  return (
    <ProtectedRoute requiredRole="admin">
    <div>
      <h1>О нас</h1>
      <p>Сайт написан по теме №22. Разработан Хохловой Елизаветой, Григораш Максимом, Кашаповой Ольгой, а также Шайкиным Ашотом.</p>
    </div>
    </ProtectedRoute>
  );
};

export default About; // Экспортируем компонент
