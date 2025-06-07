const API_URL = 'http://localhost:8000/api';

async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const config = { method, headers, credentials: 'include' };
    if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
    }
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (response.status === 204) return { success: true };
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.detail || 'Произошла ошибка при выполнении запроса');
    }
    return result;
}

const authApi = {
    login: (username, password) => apiRequest('/auth/login', 'POST', { username, password }),
    register: (username, password) => apiRequest('/auth/register', 'POST', { username, password })
};

const habitsApi = {
    getAll: token => apiRequest('/habits', 'GET', null, token),
    getById: (id, token) => apiRequest(`/habits/${id}`, 'GET', null, token),
    create: (data, token) => apiRequest('/habits', 'POST', data, token),
    update: (id, data, token) => apiRequest(`/habits/${id}`, 'PUT', data, token),
    delete: (id, token) => apiRequest(`/habits/${id}`, 'DELETE', null, token),
    archive: (id, token) => apiRequest(`/habits/${id}/archive`, 'POST', null, token),
    restore: (id, token) => apiRequest(`/habits/${id}/restore`, 'POST', null, token),
    complete: (id, token) => apiRequest(`/habits/${id}/complete`, 'POST', null, token),
    uncomplete: (id, token) => apiRequest(`/habits/${id}/uncomplete`, 'POST', null, token),
    getCompleted: token => apiRequest('/habits/completed', 'GET', null, token),
    getArchived: token => apiRequest('/habits/archived', 'GET', null, token)
};

const marksApi = {
    getByHabit: (habitId, token) => apiRequest(`/marks/habit/${habitId}`, 'GET', null, token),
    create: (markData, token) => apiRequest('/marks', 'POST', markData, token),
    delete: (id, token) => apiRequest(`/marks/${id}`, 'DELETE', null, token)
};

const profileApi = {
    getMetrics: token => apiRequest('/profile/metrics', 'GET', null, token)
};
