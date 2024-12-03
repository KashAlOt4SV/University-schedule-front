import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Импортируем Sidebar
import Home from './pages/Home';
import About from './pages/About';
import SchedulePage from './pages/SchedulePage';
import LoginPage from './pages/LoginPage';
import CreateUsersPage from './pages/CreateUsersPage';
import TeacherPage from './pages/TeacherPage';
import GroupsPage from './pages/GroupsPage';
import DisciplinesPage from './pages/DisciplinesPage';
import { Provider } from 'react-redux';
import store from './store';

const App = () => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole) {
      setRole(userRole);
    }
  }, []);

  return (
    <div>
      <Provider store={store}>
        <Sidebar role={role} />  {/* Передаем роль в Sidebar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-users" element={<CreateUsersPage />} />
          <Route path="/teachers" element={<TeacherPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/disciplines" element={<DisciplinesPage />} />
        </Routes>
      </Provider>
    </div>
  );
};

export default App;
