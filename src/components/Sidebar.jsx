import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Home, Schedule, Person, Group, LibraryBooks, Settings, PeopleAlt, Info } from '@mui/icons-material';

const Sidebar = () => {
  const location = useLocation();  // Получаем текущий маршрут

  // Функция для проверки, является ли текущий путь активным
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar" style={styles.sidebar}>
      <List style={styles.menuList}>
        <ListItem 
          button 
          component={Link} 
          to="/" 
          style={isActive("/") ? { ...styles.menuItem, ...styles.activeMenuItem } : styles.menuItem}>
          <ListItemIcon><Home style={styles.icon} /></ListItemIcon>
          <ListItemText primary="Главная" style={styles.menuText} />
        </ListItem>
        <Divider />

        <ListItem 
          button 
          component={Link} 
          to="/schedule" 
          style={isActive("/schedule") ? { ...styles.menuItem, ...styles.activeMenuItem } : styles.menuItem}>
          <ListItemIcon><Schedule style={styles.icon} /></ListItemIcon>
          <ListItemText primary="Расписание" style={styles.menuText} />
        </ListItem>
        <Divider />

        <ListItem 
          button 
          component={Link} 
          to="/login" 
          style={isActive("/login") ? { ...styles.menuItem, ...styles.activeMenuItem } : styles.menuItem}>
          <ListItemIcon><Person style={styles.icon} /></ListItemIcon>
          <ListItemText primary="Авторизация" style={styles.menuText} />
        </ListItem>
        <Divider />

        <ListItem 
          button 
          component={Link} 
          to="/disciplines" 
          style={isActive("/disciplines") ? { ...styles.menuItem, ...styles.activeMenuItem } : styles.menuItem}>
          <ListItemIcon><LibraryBooks style={styles.icon} /></ListItemIcon>
          <ListItemText primary="Дисциплины" style={styles.menuText} />
        </ListItem>
        <Divider />

        <ListItem 
          button 
          component={Link} 
          to="/groups" 
          style={isActive("/groups") ? { ...styles.menuItem, ...styles.activeMenuItem } : styles.menuItem}>
          <ListItemIcon><Group style={styles.icon} /></ListItemIcon>
          <ListItemText primary="Группы" style={styles.menuText} />
        </ListItem>
        <Divider />

        <ListItem 
          button 
          component={Link} 
          to="/about" 
          style={isActive("/about") ? { ...styles.menuItem, ...styles.activeMenuItem } : styles.menuItem}>
          <ListItemIcon><Info style={styles.icon} /></ListItemIcon>
          <ListItemText primary="О нас" style={styles.menuText} />
        </ListItem>
        <Divider />

        <ListItem 
          button 
          component={Link} 
          to="/create-users" 
          style={isActive("/create-users") ? { ...styles.menuItem, ...styles.activeMenuItem } : styles.menuItem}>
          <ListItemIcon><PeopleAlt style={styles.icon} /></ListItemIcon>
          <ListItemText primary="Пользователи" style={styles.menuText} />
        </ListItem>
        <Divider />

        <ListItem 
          button 
          component={Link} 
          to="/teachers" 
          style={isActive("/teachers") ? { ...styles.menuItem, ...styles.activeMenuItem } : styles.menuItem}>
          <ListItemIcon><Person style={styles.icon} /></ListItemIcon>
          <ListItemText primary="Преподаватели" style={styles.menuText} />
        </ListItem>
      </List>
    </div>
  );
};

// Стили для бокового меню
const styles = {
  sidebar: {
    width: 250,
    backgroundColor: '#1976d2',  // Синий фон
    height: '100vh',
    color: '#fff',
    paddingTop: '20px',
    paddingLeft: '15px',
    position: 'fixed',
  },
  menuList: {
    padding: 0,
  },
  menuItem: {
    '&:hover': {
      backgroundColor: '#1565c0',  // Более темный синий при наведении
    },
  },
  activeMenuItem: {
    backgroundColor: '#1565c0',  // Более темный цвет для активной страницы
  },
  menuText: {
    color: '#fff',
  },
  icon: {
    color: '#fff',
  },
};

export default Sidebar;
