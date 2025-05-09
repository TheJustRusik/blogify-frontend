import axios from 'axios';

// Создаём инстанс axios
const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// Добавляем токен в каждый запрос
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Обработка ошибок авторизации
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Удаляем токен
            localStorage.removeItem('token');

        }
        return Promise.reject(error);
    }
);

export default api;
