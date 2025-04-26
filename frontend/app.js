// app.js

// ——————————————————————————————
// Глобальные переменные и старт
// ——————————————————————————————
let currentUser = null;

document.addEventListener('DOMContentLoaded', initApp);

// ——————————————————————————————
// Инициализация приложения
// ——————————————————————————————
function initApp() {
  if (isAuthenticated()) {
    loadUserData();
  }
  initEventListeners();
}

// ——————————————————————————————
// Загрузка данных пользователя
// ——————————————————————————————
function loadUserData() {
  loadHabits();
}

// ——————————————————————————————
// Обработчики событий
// ——————————————————————————————
function initEventListeners() {
  // 1) Профиль
  document
    .getElementById('profile-btn')
    .addEventListener('click', () => (window.location.href = 'profile.html'));

  // 2) Закрытие всех модальных окон по Escape
  document.addEventListener('keydown', handleEscape);

  // В будущем сюда можно добавлять новые глобальные обработчики
}

function handleEscape(e) {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}

// ——————————————————————————————
// Утилиты авторизации (пример)
// ——————————————————————————————
function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}
