// Управление привычками на фронтенде
const habitsList = document.getElementById('habits-list');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitForm = document.getElementById('habit-form');
const habitModal = document.getElementById('habit-modal');
const modalCloseBtn = habitModal.querySelector('.close');
const cancelHabitBtn = document.getElementById('cancel-habit');

let habits = [];

// Открытие модального окна
function openHabitModal(editingId = null) {
  // Сброс формы
  habitForm.reset();
  delete habitForm.dataset.editing;
  document.getElementById('habit-modal-title').textContent = editingId ? 'Редактировать привычку' : 'Добавить привычку';
  if (editingId) habitForm.dataset.editing = editingId;
  habitModal.style.display = 'block';
}

// Закрытие модального окна
function closeHabitModal() {
  habitModal.style.display = 'none';
}

function renderCompletedHabits() {
    const completedList = document.getElementById('completed-today-list');
    completedList.innerHTML = '';

    if (completedHabits.length === 0) {
        completedList.innerHTML = '<li>Нет выполненных привычек</li>';
        return;
    }

    completedHabits.forEach(habit => {
        const li = document.createElement('li');
        li.textContent = habit.name;
        completedList.appendChild(li);
    });
}



async function loadHabits() {
    try {
        const token = getToken();
        habits = await habitsApi.getAll(token);
        // Фильтруем архивные привычки: показываем только active
        // habits = habits.filter(habit => !habit.archived);
        habits = habits.filter(h => !h.archived && !h.completed);

        renderHabits();
        renderCompletedToday();
    } catch (error) {
        console.error('Ошибка при загрузке привычек:', error);
    }
}

// Отображение списка привычек
function renderHabits() {
    habitsList.innerHTML = '';

    // Отбираем привычки, которые НЕ архивированы и НЕ выполнены
    const activeHabits = habits.filter(habit => !habit.archived && !habit.completed);

    if (activeHabits.length === 0) {
        habitsList.innerHTML = '<div class="empty-state">У вас пока нет активных привычек.</div>';
        return;
    }

    activeHabits.forEach(habit => {
        const habitElement = document.createElement('div');
        habitElement.className = 'habit-item';
        habitElement.innerHTML = `
            <div class="habit-info">
                <h3>${habit.name}</h3>
                <p>${habit.description || ''}</p>
            </div>
            <div class="habit-actions">
                <button class="btn icon-btn edit-habit" data-id="${habit.id}"><i class="fas fa-edit"></i></button>
                <button class="btn icon-btn archive-habit" data-id="${habit.id}"><i class="fas fa-archive"></i></button>
                <button class="btn icon-btn delete-habit" data-id="${habit.id}"><i class="fas fa-trash"></i></button>
                <button class="btn icon-btn complete-habit" data-id="${habit.id}"><i class="fa-solid fa-circle-check"></i></button>
            </div>
        `;

        habitsList.appendChild(habitElement);

        habitElement.querySelector('.complete-habit').addEventListener('click', () => completeHabit(habit.id));
        habitElement.querySelector('.edit-habit').addEventListener('click', () => openHabitModal(habit.id));
        habitElement.querySelector('.delete-habit').addEventListener('click', () => deleteHabit(habit.id));
        habitElement.querySelector('.archive-habit').addEventListener('click', () => archiveHabit(habit.id));
    });
}



async function loadHabits() {
    try {
        const token = getToken();
        habits = await habitsApi.getAll(token);
        habits = habits.filter(habit => !habit.archived);
        renderHabits();
        renderCompletedToday();
    } catch (error) {
        console.error('Ошибка при загрузке привычек:', error);
    }
}





// Добавление новой привычки
async function addHabit() {
    const name = document.getElementById('habit-name').value.trim();
    const description = document.getElementById('habit-description').value.trim();
    if (!name) {
        alert('Название привычки не может быть пустым.');
        return;
    }
    try {
        const token = getToken();
        const newHabit = await habitsApi.create({ name, description }, token);
        habits.push(newHabit);
        renderHabits();
        closeHabitModal();
    } catch (error) {
        console.error('Ошибка при добавлении привычки:', error);
        alert('Не удалось добавить привычку. Попробуйте еще раз.');
    }
}

// Обновление привычки
async function updateHabit(habitId) {
    const name = document.getElementById('habit-name').value.trim();
    const description = document.getElementById('habit-description').value.trim();
    if (!name) {
        alert('Название привычки не может быть пустым.');
        return;
    }
    try {
        const token = getToken();
        const updated = await habitsApi.update(habitId, { name, description }, token);
        const idx = habits.findIndex(h => h.id === habitId);
        habits[idx] = updated;
        renderHabits();
        closeHabitModal();
    } catch (error) {
        console.error('Ошибка при обновлении привычки:', error);
        alert('Не удалось обновить привычку. Попробуйте еще раз.');
    }
}

habitForm.addEventListener('submit', event => {
    event.preventDefault();
    const editingId = habitForm.dataset.editing;
    if (editingId) updateHabit(editingId);
    else addHabit();
});

addHabitBtn.addEventListener('click', () => openHabitModal());
modalCloseBtn.addEventListener('click', closeHabitModal);
cancelHabitBtn.addEventListener('click', closeHabitModal);
window.addEventListener('click', event => {
  if (event.target === habitModal) closeHabitModal();
});

async function archiveHabit(habitId) {
    if (!confirm('Вы уверены, что хотите архивировать эту привычку?')) return;
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



async function completeHabit(habitId) {
    console.log('Complete clicked', habitId);
    try {
        const token = getToken();
        await habitsApi.complete(habitId, token);
        console.log('Complete API request done');

        const completedHabit = habits.find(h => h.id === habitId);
        if (completedHabit) {
            completedHabit.completed = true;  // ← ставим галочку
        }

        renderHabits();          // обновляем активные привычки
        renderCompletedToday();  // обновляем выполненные привычки
    } catch (error) {
        console.error('Ошибка при выполнении привычки:', error);
        alert('Не удалось отметить привычку как выполненную.');
    }
}




// Инициализация
loadHabits();

