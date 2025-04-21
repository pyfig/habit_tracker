// Управление аутентификацией

// Получение элементов формы
const authContainer = document.getElementById('auth-container');
const appContent = document.getElementById('app-content');
const loginForm = document.getElementById('login-form-element');
const registerForm = document.getElementById('register-form-element');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const logoutBtn = document.getElementById('logout-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

// Функция для сохранения токена в localStorage
function saveToken(token) {
    localStorage.setItem('token', token);
}

// Функция для получения токена из localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Функция для удаления токена из localStorage
function removeToken() {
    localStorage.removeItem('token');
}

// Функция для проверки авторизации пользователя
function isAuthenticated() {
    return !!getToken();
}

// Функция для переключения между формами входа и регистрации
function switchAuthForm(formId) {
    authForms.forEach(form => {
        form.classList.remove('active');
    });
    
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${formId}-form`).classList.add('active');
    document.querySelector(`[data-tab="${formId}"]`).classList.add('active');
}

// Функция для переключения между контейнерами аутентификации и приложения
function switchContainer() {
    if (isAuthenticated()) {
        authContainer.classList.add('hidden');
        appContent.classList.remove('hidden');
        loadUserData(); // Загрузка данных пользователя
    } else {
        authContainer.classList.remove('hidden');
        appContent.classList.add('hidden');
    }
}

// Обработчик отправки формы входа
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        loginError.textContent = '';
        const response = await authApi.login(username, password);
        saveToken(response.access_token);
        switchContainer();
    } catch (error) {
        loginError.textContent = error.message || 'Ошибка входа. Проверьте имя пользователя и пароль.';
    }
});

// Обработчик отправки формы регистрации
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    if (password !== passwordConfirm) {
        registerError.textContent = 'Пароли не совпадают';
        return;
    }
    
    try {
        registerError.textContent = '';
        await authApi.register(username, password);
        // После успешной регистрации выполняем вход
        const response = await authApi.login(username, password);
        saveToken(response.access_token);
        switchContainer();
    } catch (error) {
        registerError.textContent = error.message || 'Ошибка регистрации. Попробуйте другое имя пользователя.';
    }
});

// Обработчик нажатия на кнопку выхода
logoutBtn.addEventListener('click', () => {
    removeToken();
    switchContainer();
});

// Обработчики переключения вкладок
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        switchAuthForm(tabId);
    });
});

// Проверка аутентификации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    switchContainer();
});