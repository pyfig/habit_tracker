
// Глобальные переменные и инициализация
let currentUser = null;

// Функция для инициализации приложения
function initApp() {
    // Проверяем, авторизован ли пользователь
    if (isAuthenticated()) {
        // Если авторизован, загружаем данные пользователя
        loadUserData();
    }
    
    // Инициализируем обработчики событий
    initEventListeners();
}

// Функция для загрузки данных пользователя
function loadUserData() {
    // Загружаем привычки пользователя
    loadHabits();
}

// Функция для инициализации обработчиков событий
function initEventListeners() {
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Запускаем инициализацию приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', initApp);