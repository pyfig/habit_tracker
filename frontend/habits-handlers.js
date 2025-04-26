<<<<<<< HEAD
// frontend/habits-handlers.js

const HabitsManager = {
    // DOM elements
    listEl: document.getElementById('habits-list'),
    priorityFilterEl: document.getElementById('priority-filter'),
    importanceFilterEl: document.getElementById('importance-filter'),
    addBtn: document.getElementById('add-habit-btn'),
  
    // State (assumes global `habits` array is kept in sync)
    get habits() { return window.habits || []; },
    set habits(v) { window.habits = v; },
  
    init() {
      // bind filter controls
      this.priorityFilterEl.addEventListener('change', () => this.render());
      this.importanceFilterEl.addEventListener('change', () => this.render());
  
      // add-habit button handler
      if (this.addBtn) {
        this.addBtn.addEventListener('click', () => this.openAddModal());
      }
  
      // event delegation for buttons and sliders
      this.listEl.addEventListener('click', e => this.handleClick(e));
      this.listEl.addEventListener('input', e => this.handleInput(e));
  
      // initial render
      this.render();
    },
  
    openAddModal() {
      // reset form
      const form = document.getElementById('habit-form');
      form.reset();
      delete form.dataset.editing;
      document.getElementById('habit-priority-value').textContent = form.querySelector('#habit-priority').value;
      document.getElementById('habit-importance-value').textContent = form.querySelector('#habit-importance').value;
      // show modal
      document.getElementById('habit-modal').style.display = 'block';
    },
  
    // Render the list based on filters
    render() {
      const pFilter = this.priorityFilterEl.value;
      const iFilter = this.importanceFilterEl.value;
  
      let filtered = this.habits;
      if (pFilter) filtered = filtered.filter(h => String(h.priority) === pFilter);
      if (iFilter) filtered = filtered.filter(h => String(h.importance) === iFilter);
  
      if (filtered.length === 0) {
        this.listEl.innerHTML = `<div class="empty-state">У вас пока нет привычек.</div>`;
=======
// Управление привычками на фронтенде
const habitsList = document.getElementById('habits-list');

// Отображение списка привычек
function renderHabits() {
    habitsList.innerHTML = '';
    if (habits.length === 0) {
        habitsList.innerHTML = '<div class="empty-state">У вас пока нет привычек.</div>';
>>>>>>> 1b17dc0 (Added archieved and completed habits, with new api endpoint in habits py, realationships in model.py)
        return;
      }
  
      // build HTML
      this.listEl.innerHTML = filtered.map(habit => `
        <div class="habit-item" data-id="${habit.id}">
          <div class="habit-info">
            <h3>${habit.name}</h3>
            <p>${habit.description || ''}</p>
          </div>
          <div class="state-slider-container">
            <label>Состояние: <span class="state-value">0%</span></label>
            <input type="range" class="state-slider" data-action="slide" min="0" max="100" value="0">
          </div>
          <div class="habit-actions">
            <button class="icon-btn" data-action="edit"><i class="fas fa-edit"></i></button>
            <button class="icon-btn" data-action="delete"><i class="fas fa-trash"></i></button>
            <button class="icon-btn" data-action="archive"><i class="fas fa-archive"></i></button>
          </div>
        </div>
      `).join('');
    },
  
    // Handle click on edit/delete/archive
    async handleClick(e) {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const itemEl = btn.closest('.habit-item');
      const habitId = itemEl.dataset.id;
  
      switch(action) {
        case 'edit': this.editHabit(habitId); break;
        case 'delete': await this.deleteHabit(habitId); break;
        case 'archive': await this.archiveHabit(habitId); break;
      }
    },
  
    // Handle slider input
    handleInput(e) {
      if (!e.target.matches('.state-slider')) return;
      const slider = e.target;
      const val = slider.value;
      const itemEl = slider.closest('.habit-item');
      itemEl.querySelector('.state-value').textContent = `${val}%`;
      const hue = (val / 100) * 120;
      itemEl.style.backgroundColor = `hsl(${hue},70%,90%)`;
    },
  
    editHabit(id) {
      const habit = this.habits.find(h=>h.id===id);
      if (!habit) return;
      document.getElementById('habit-name').value = habit.name;
      document.getElementById('habit-description').value = habit.description || '';
      document.getElementById('habit-priority').value = habit.priority;
      document.getElementById('habit-priority-value').textContent = habit.priority;
      document.getElementById('habit-importance').value = habit.importance;
      document.getElementById('habit-importance-value').textContent = habit.importance;
      document.getElementById('habit-form').dataset.editing = id;
      document.getElementById('habit-modal').style.display = 'block';
    },
  
    async deleteHabit(id) {
      try {
        if (!confirm('Удалить эту привычку?')) return;
        await habitsApi.remove(id);
        this.habits = this.habits.filter(h=>h.id!==id);
        this.render();
        Calendar.renderCompletedToday();
        showNotification('Привычка удалена','success');
      } catch (err) {
        console.error(err);
        showNotification('Не удалось удалить привычку','error');
      }
    },
  
    async archiveHabit(id) {
      try {
        if (!confirm('Архивировать эту привычку?')) return;
        await habitsApi.archive(id);
        this.habits = this.habits.filter(h=>h.id!==id);
        this.render();
        Calendar.renderCompletedToday();
        showNotification('Привычка в архиве','success');
      } catch (err) {
        console.error(err);
        showNotification('Не удалось архивировать','error');
      }
    }
<<<<<<< HEAD
  };
  
  // Инициализация после загрузки страницы и после того, что глобальный массив habits заполнен
  document.addEventListener('DOMContentLoaded', () => HabitsManager.init());
  
=======

    habits.forEach(habit => {
        const habitElement = document.createElement('div');
        habitElement.className = 'habit-item';
        habitElement.innerHTML = `
            <div class="habit-info">
                <h3>${habit.name}</h3>
                <p>${habit.description || ''}</p>
            </div>
            <div class="habit-actions">
                <button class="btn icon-btn edit-habit" data-id="${habit.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn icon-btn delete-habit" data-id="${habit.id}">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn icon-btn archive-habit" data-id="${habit.id}">
                    <i class="fas fa-archive"></i>
                </button>
            </div>
        `;

        habitsList.appendChild(habitElement);

        // Назначаем события на кнопки
        habitElement.querySelector('.edit-habit')
            .addEventListener('click', () => editHabit(habit.id));
        habitElement.querySelector('.delete-habit')
            .addEventListener('click', () => deleteHabit(habit.id));
        habitElement.querySelector('.archive-habit')
            .addEventListener('click', () => archiveHabit(habit.id));
    });
}

// Архивирование привычки
async function archiveHabit(habitId) {
    if (!confirm('Вы уверены, что хотите архивировать эту привычку?')) {
        return;
    }
    try {
        const token = getToken();
        await habitsApi.archive(habitId, token);
        habits = habits.filter(habit => habit.id !== habitId);
        renderHabits();
        renderCompletedToday();
    } catch (error) {
        console.error('Ошибка при архивировании привычки:', error);
        alert('Не удалось архивировать привычку. Попробуйте еще раз.');
    }
}

// Удаление привычки
async function deleteHabit(habitId) {
    if (!confirm('Удалить эту привычку?')) return;
    try {
        const token = getToken();
        await habitsApi.delete(habitId, token);
        habits = habits.filter(habit => habit.id !== habitId);
        renderHabits();
        renderCompletedToday();
    } catch (error) {
        console.error('Ошибка при удалении привычки:', error);
        alert('Не удалось удалить привычку. Попробуйте ещё раз.');
    }
}

// Редактирование привычки
function editHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    document.getElementById('habit-name').value = habit.name;
    document.getElementById('habit-description').value = habit.description || '';
    document.getElementById('habit-form').dataset.editing = habitId;
}
>>>>>>> 1b17dc0 (Added archieved and completed habits, with new api endpoint in habits py, realationships in model.py)
