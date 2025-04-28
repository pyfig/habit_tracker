// apiClient.js

const API_URL = 'http://localhost:8000/api';

class ApiClient {
  constructor(baseURL = API_URL) {
    this.baseURL = baseURL;
    this.tokenKey = 'auth_token';
  }

  // Получить токен из localStorage
  get token() {
    return localStorage.getItem(this.tokenKey);
  }

  // Сохранить токен
  set token(value) {
    if (value) {
      localStorage.setItem(this.tokenKey, value);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  // Универсальный метод запросов
  async request(endpoint, { method = 'GET', data = null } = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers,
      credentials: 'include'
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      config.body = JSON.stringify(data);
    }

    console.debug('[API Request]', method, url, data ? data : '');

    const res = await fetch(url, config);

    // 204 No Content
    if (res.status === 204) {
      return null;
    }

    let payload;
    try {
      payload = await res.json();
    } catch {
      throw new Error(`Invalid JSON in response from ${endpoint}`);
    }

    if (!res.ok) {
      const msg = payload.detail || payload.message || res.statusText;
      throw new Error(`API Error (${res.status}): ${msg}`);
    }

    return payload;
  }

  // Аутентификация
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      data: { username, password }
    });
    if (data.token) this.token = data.token;
    return data;
  }

  async register(username, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      data: { username, password }
    });
    if (data.token) this.token = data.token;
    return data;
  }
  async completeHabit(id) {
    return this.request(`/habits/${id}/complete`, {
      method: 'POST'
    });
  }  
  async logout() {
    this.token = null;
  }

  // Привычки
  async getHabits() {
    return this.request('/habits', { method: 'GET' });
  }

  async getHabitById(id) {
    return this.request(`/habits/${id}`, { method: 'GET' });
  }

  // Обновленный метод createHabit с обработкой ошибок
  async createHabit(habit) {
    try {
      const data = await this.request('/habits', {
        method: 'POST',
        data: habit
      });
      console.log('Привычка успешно создана:', data);
      return data;
    } catch (error) {
      console.error('Ошибка создания привычки:', error);
      throw new Error('Не удалось сохранить привычку');
    }
  }
  
  async syncCalendar(habitId) {
    const marks = await this.getMarks(habitId);
    return marks;
  }

  async updateHabit(id, habit) {
    return this.request(`/habits/${id}`, {
      method: 'PUT',
      data: habit
    });
  }

  async deleteHabit(id) {
    return this.request(`/habits/${id}`, { method: 'DELETE' });
  }

  
  async getMarks(habitId) {
    return this.request(`/marks/habit/${habitId}`, { method: 'GET' });
  }

  async createMark(mark) {
    return this.request('/marks', {
      method: 'POST',
      data: mark
    });
  }

  async deleteMark(id) {
    return this.request(`/marks/${id}`, { method: 'DELETE' });
  }
}

// Создаем глобальный экземпляр API клиента
const api = new ApiClient();

// Делаем методы API доступными глобально
const habitsApi = {
  getAll: (token) => api.getHabits(),
  getById: (id, token) => api.getHabitById(id),
  create: (habitData, token) => api.createHabit(habitData),
  update: (id, habitData, token) => api.updateHabit(id, habitData),
  delete: (id, token) => api.deleteHabit(id),
  complete: (id, token) => api.completeHabit(id)  
};

// API для работы с отметками
const marksApi = {
  getByHabit: (habitId, token) => api.getMarks(habitId),
  create: (markData, token) => api.createMark(markData),
  delete: (id, token) => api.deleteMark(id)
};
