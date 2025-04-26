// frontend/profile.js
import { profileApi } from './api.js';
import { showNotification } from './app.js';

document.addEventListener('DOMContentLoaded', initProfile);

function initProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });

  loadProfile();
}

async function loadProfile() {
  try {
    const data = await profileApi.getProfile();
    updateField('total-habits', data.total_habits);
    updateField('completed-habits', data.completed_habits);
    updateField('green-days', data.green_days);
    updateField('archived-habits', data.archived_habits);
  } catch (err) {
    console.error('Ошибка при загрузке профиля:', err);
    showNotification('Не удалось загрузить профиль. Попробуйте позже.', 'error');
  }
}

function updateField(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
