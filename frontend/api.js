// api.js

// Базовый URL нашего API
const API_URL = 'http://localhost:8000/api';

// Главный объект для работы с API
const api = {
  // Универсальный запрос
  async request(endpoint, { method = 'GET', data = null } = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (data) config.body = JSON.stringify(data);

    let res;
    try {
      res = await fetch(url, config);
    } catch (networkError) {
      throw new Error('Сетевая ошибка. Проверьте соединение.');
    }

    // HTTP 204 No Content
    if (res.status === 204) {
      return null;
    }

<<<<<<< HEAD
    let payload;
    try {
      payload = await res.json();
    } catch {
      throw new Error('Некорректный ответ сервера.');
=======

// API для работы с привычками
const habitsApi = {
    getAll: async (token) => {
        return apiRequest('/habits', 'GET', null, token);
    },
    getById: async (id, token) => {
        return apiRequest(`/habits/${id}`, 'GET', null, token);
    },
    create: async (habitData, token) => {
        return apiRequest('/habits', 'POST', habitData, token);
    },
    update: async (id, habitData, token) => {
        return apiRequest(`/habits/${id}`, 'PUT', habitData, token);
    },
    delete: async (id, token) => {
        return apiRequest(`/habits/${id}`, 'DELETE', null, token);
    },
    archive: async (id, token) => {
        return apiRequest(`/habits/${id}/archive`, 'POST', null, token);
>>>>>>> 1b17dc0 (Added archieved and completed habits, with new api endpoint in habits py, realationships in model.py)
    }

<<<<<<< HEAD
    if (!res.ok) {
      // ожидаем { message: "..." } от сервера
      const msg = payload.message || payload.detail || 'Неизвестная ошибка сервера.';
      throw new Error(msg);
    }

    return payload;
  },

  // Удобные обёртки
  get(endpoint)    { return this.request(endpoint, { method: 'GET' }); },
  post(endpoint, data) { return this.request(endpoint, { method: 'POST', data }); },
  put(endpoint, data)  { return this.request(endpoint, { method: 'PUT',    data }); },
  remove(endpoint)     { return this.request(endpoint, { method: 'DELETE'  }); },
};

// Экспорт отдельных API

export const authApi = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  register: (username, password) =>
    api.post('/auth/register', { username, password }),
};

export const profileApi = {
  getProfile: () => api.get('/profile'),
};

export const habitsApi = {
  getAll: () => api.get('/habits'),
  getById: id => api.get(`/habits/${id}`),
  create: data => api.post('/habits', data),
  update: (id, data) => api.put(`/habits/${id}`, data),
  remove: id => api.remove(`/habits/${id}`),
  archive: id => api.post(`/habits/${id}/archive`),
};

export const marksApi = {
  getByHabit: habitId => api.get(`/marks/habit/${habitId}`),
  create: data => api.post('/marks', data),
  remove: id => api.remove(`/marks/${id}`),
};
=======



// API для работы с отметками
const marksApi = {
    // Получение всех отметок по привычке (сейчас путь /api/marks/habit/{habitId})
    getByHabit: async (habitId, token) => {
      return apiRequest(`/marks/habit/${habitId}`, 'GET', null, token);
    },
  
    // Создание новой отметки (используем переданную дату date)
    create: async (markData, token) => {
      return apiRequest('/marks', 'POST', markData, token);
    },
  
    // Удаление отметки по id
    delete: async (id, token) => {
      return apiRequest(`/marks/${id}`, 'DELETE', null, token);
    }
  };
  
>>>>>>> 1b17dc0 (Added archieved and completed habits, with new api endpoint in habits py, realationships in model.py)
