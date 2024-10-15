import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";
import { register } from "../services/AuthService"; // Экшн для регистрации

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Достаем текущего пользователя из состояния

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/"); // Если пользователь не админ, перенаправляем на главную страницу
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register ({ email, password, role }))
      .then(() => {
        navigate("/"); // После успешной регистрации перенаправляем на главную страницу
      })
      .catch((error) => {
        console.error("Ошибка регистрации:", error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Регистрация пользователя
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Роль"
          variant="outlined"
          fullWidth
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Зарегистрировать
        </Button>
      </form>
    </Container>
  );
};

export default RegisterPage;
