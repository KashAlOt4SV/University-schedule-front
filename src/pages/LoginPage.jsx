// src/pages/LoginPage.jsx

import React, { useState } from "react"; // Импортируем React и useState
import { useDispatch } from "react-redux"; // Импортируем useDispatch из react-redux
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate из react-router-dom
import AuthService from "../services/AuthService"
import { Button, TextField, Typography } from "@mui/material"; // Импортируем компоненты Material-UI

const LoginPage = () => {
  // Состояния для хранения введенных данных
  const [email, setEmail] = useState(""); // Изменяем имя состояния с username на email
  const [password, setPassword] = useState("");
  const dispatch = useDispatch(); // Получаем dispatch для отправки действий
  const navigate = useNavigate(); // Получаем navigate для перенаправления

  const handleLogin = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    try {
      // Вызываем метод login из AuthService с введенными данными
      const { token, user } = await AuthService.login({ email, password });
      
      // Здесь вы можете добавить действие для сохранения токена и пользователя в Redux, если это необходимо
      // Например: dispatch(loginSuccess(user));

      localStorage.setItem("token", token); // Сохраняем токен в localStorage
      navigate("/dashboard"); // Перенаправляем на страницу после успешного входа
    } catch (error) {
      console.error("Ошибка входа:", error.message); // Логируем ошибку в консоль
      // Здесь можно добавить обработку ошибок для уведомления пользователя
    }
  };

  return (
    <div>
      <Typography variant="h4">Вход в приложение</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email" // Изменяем на Email
          variant="outlined"
          fullWidth
          margin="normal"
          value={email} // Используем состояние email
          onChange={(e) => setEmail(e.target.value)} // Обновляем состояние email
          required
        />
        <TextField
          label="Пароль"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Обновляем состояние пароля
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Войти
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
