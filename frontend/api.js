// API URL
const API_URL = 'http://localhost:8000/api';

// Функция для выполнения запросов к API
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        method,
        headers,
        credentials: 'include'
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
    }
    
    try {
        console.log('Request:', `${API_URL}${endpoint}`, config);
        const response = await fetch(`${API_URL}${endpoint}`, config);
        
        if (response.status === 204) {
            return { success: true };
        }
        
        const result = await response.json();
        console.log('Response:', result);
        
        if (!response.ok) {
            throw new Error(result.detail || 'Произошла ошибка при выполнении запроса');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw new Error(`API Error: ${error.message} (endpoint: ${endpoint})`);
    }
}

// API для аутентификации
const authApi = {
    login: async (username, password) => {
        return apiRequest('/auth/login', 'POST', { username, password });
    },
    
    register: async (username, password) => {
        return apiRequest('/auth/register', 'POST', { username, password });
    }
};


// API для работы с привычками
const habitsApi = {
    getAll: (token) => apiRequest('/habits', 'GET', null, token),
    getById: (id, token) => apiRequest(`/habits/${id}`, 'GET', null, token),
    create: (data, token) => apiRequest('/habits', 'POST', data, token),
    update: (id, data, token) => apiRequest(`/habits/${id}`, 'PUT', data, token),
    delete: (id, token) => apiRequest(`/habits/${id}`, 'DELETE', null, token),
    archive: (id, token) => apiRequest(`/habits/${id}/archive`, 'POST', null, token),
    restore: (id, token) => apiRequest(`/habits/${id}/restore`, 'POST', null, token),
    complete: (id, token) => apiRequest(`/habits/${id}/complete`, 'POST', null, token),
    uncomplete: (id, token) => apiRequest(`/habits/${id}/uncomplete`, 'POST', null, token),
    getCompleted: (token) => apiRequest('/habits/completed', 'GET', null, token),
    getArchived: (token) => apiRequest('/habits/archived', 'GET', null, token)
};




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
    },
    create: async (markData, token) => {
      return apiRequest('/marks', 'POST', markData, token);
    }
  };
  