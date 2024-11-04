// authService.js
import axios from 'axios';
import store from '../store'; // Импортируем store Redux
import { setUserRole } from '../redux/slices/scheduleSlice'; // Импортируем экшен для установки роли

class AuthService {
  async login(credentials) {
    const response = await axios.post('/api/auth/login', credentials);
    const { token, user } = response.data;

    // Сохраняем токен в localStorage
    localStorage.setItem('token', token);

    // Диспатчим роль пользователя в Redux
    store.dispatch(setUserRole(user.role));

    return response.data;
  }

  logout() {
    // Удаляем токен из localStorage
    localStorage.removeItem('token');
    store.dispatch(setUserRole(null)); // Сбрасываем роль пользователя
  }
}

export default new AuthService();
