
// Глобальные переменные и инициализация
let currentUser = null;

// Функция для инициализации приложения
async function initApp() {
    if (isAuthenticated()) {
        await loadUserData(); // Добавлен await
    }
    initEventListeners();
}

// Функция для загрузки данных пользователя
function loadUserData() {
    loadHabits().then(() => {
        loadAllMarks(); // Загружаем отметки после загрузки привычек
    }).catch(error => {
        console.error('Ошибка при загрузке данных:', error);
    });
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