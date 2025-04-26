// Управление привычками на фронтенде
const habitsList = document.getElementById('habits-list');

// Отображение списка привычек
function renderHabits() {
    habitsList.innerHTML = '';
    if (habits.length === 0) {
        habitsList.innerHTML = '<div class="empty-state">У вас пока нет привычек.</div>';
        return;
    }

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
