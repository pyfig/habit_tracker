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
    }
};

// API для работы с отметками
const marksApi = {
    getByHabit: async (habitId, token) => {
        return apiRequest(`/marks/habit/${habitId}`, 'GET', null, token);
    },
    
    create: async (markData, token) => {
        return apiRequest('/marks', 'POST', markData, token);
    },
    
    delete: async (id, token) => {
        return apiRequest(`/marks/${id}`, 'DELETE', null, token);
    }
};