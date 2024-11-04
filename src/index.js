// Импортируем необходимые библиотеки
import React from "react";
import { Provider } from "react-redux"; // Подключаем Redux для управления состоянием
import ReactDOM from "react-dom/client";
import App from "./App"; // Импортируем компонент App
import CssBaseline from "@mui/material/CssBaseline"; // CssBaseline из MUI для сброса стилей
import { BrowserRouter } from "react-router-dom"; // Подключаем маршрутизацию

import "./index.scss"; // Импортируем глобальные стили
import { ThemeProvider, createTheme } from "@mui/material"; // Импортируем тему для MUI
import store from './store'; // Импортируем хранилище Redux тестовый коммит елки палки

// Создаем кастомную тему MUI
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Цвет для основного стиля
    },
    secondary: {
      main: '#f50057', // Цвет для второстепенного стиля
    },
  },
});

// Создаем корневой элемент React
const root = ReactDOM.createRoot(document.getElementById("root"));

// Рендерим приложение
root.render(
  <>
    {/* CssBaseline для сброса базовых стилей */}
    <CssBaseline />

    {/* Подключаем тему через ThemeProvider */}
    <ThemeProvider theme={theme}>
      {/* Подключаем маршрутизацию через BrowserRouter */}
      <BrowserRouter>
        {/* Подключаем Redux через Provider */}
        <Provider store={store}>
          {/* Рендерим главный компонент приложения */}
          <App />
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  </>
);