import axios from 'axios';
import {emitter} from "@/Emitter.js";

// Создаём инстанс axios
const api = axios.create({
    baseURL: 'https://blogify.kenuki.dev/api',
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
            emitter.emit("logout");
        }
        return Promise.reject(error);
    }

);

export default api;
