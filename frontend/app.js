// Основной файл приложения

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

// Функция для инициализации обработчиков событий
function initEventListeners() {
    // Обработчики событий для аутентификации уже определены в auth.js
    // Обработчики событий для привычек уже определены в habits.js
    // Обработчики событий для календаря уже определены в calendar.js
    
    // Дополнительные обработчики событий можно добавить здесь
    document.addEventListener('keydown', (e) => {
        // Закрытие модальных окон при нажатии Escape
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