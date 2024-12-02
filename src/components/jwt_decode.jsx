import { jwtDecode } from 'jwt-decode';

// Функция для получения роли пользователя из токена
const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.role; // Возвращаем роль пользователя
  }
  return null; // Если токен отсутствует, возвращаем null
};

export default getUserRole;