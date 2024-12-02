// components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/schedule">Расписание</Link></li>
        <li><Link to="/login">Авторизация</Link></li>
        {role === 'admin' && <li><Link to="/users">Пользователи</Link></li>}
        {role === 'academic_affairs' && (
          <>
            <li><Link to="/disciplines">Дисциплины</Link></li>
            <li><Link to="/groups">Группы</Link></li>
            <li><Link to="/classTypes">Виды занятий</Link></li>
          </>
        )}
        {role === 'dispatcher' && (
          <li><Link to="/schedule/edit">Редактировать расписание</Link></li>
        )}
        {role === 'department_head' && <li><Link to="/teachers">Преподаватели</Link></li>}
      </ul>
    </div>
  );
};

export default Sidebar;
