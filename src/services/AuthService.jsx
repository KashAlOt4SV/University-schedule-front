import axios from 'axios';

// Регистрация пользователя
export const register = async (userData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', userData);
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message || 'Ошибка регистрации');
  }
};

// Авторизация пользователя
export const login = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message || 'Ошибка авторизации');
  }
};
