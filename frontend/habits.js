// Управление привычками

// Получение элементов
const habitsList = document.getElementById('habits-list');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitModal = document.getElementById('habit-modal');
const habitForm = document.getElementById('habit-form');
const habitModalTitle = document.getElementById('habit-modal-title');
const habitIdInput = document.getElementById('habit-id');
const habitNameInput = document.getElementById('habit-name');
const habitDescriptionInput = document.getElementById('habit-description');
const cancelHabitBtn = document.getElementById('cancel-habit');
const closeModalBtn = document.querySelector('.close');

// Глобальные переменные
let habits = [];

// Функция для загрузки привычек пользователя
async function loadHabits() {
    try {
        const token = getToken();
        habits = await habitsApi.getAll(token);
        renderHabits();
        updateCalendar(); // Обновляем календарь после загрузки привычек
    } catch (error) {
        console.error('Ошибка при загрузке привычек:', error);
    }
}

// Функция для отображения привычек
function renderHabits() {
    habitsList.innerHTML = '';
    
    if (habits.length === 0) {
        habitsList.innerHTML = '<p class="no-habits">У вас пока нет привычек. Нажмите "Добавить", чтобы создать первую привычку.</p>';
        return;
    }
    
    habits.forEach(habit => {
        const habitElement = document.createElement('div');
        habitElement.className = 'habit-item';
        habitElement.innerHTML = `
            <div class="habit-header">
                <h3 class="habit-title">${habit.name}</h3>
                <div class="habit-actions">
                    <button class="habit-action edit-habit" data-id="${habit.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="habit-action delete-habit" data-id="${habit.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="habit-description">${habit.description || 'Нет описания'}</p>
        `;
        
        habitsList.appendChild(habitElement);
    });
    
    // Добавляем обработчики событий для кнопок редактирования и удаления
    document.querySelectorAll('.edit-habit').forEach(btn => {
        btn.addEventListener('click', () => editHabit(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.delete-habit').forEach(btn => {
        btn.addEventListener('click', () => deleteHabit(btn.getAttribute('data-id')));
    });
}

// Функция для открытия модального окна добавления привычки
function openAddHabitModal() {
    habitModalTitle.textContent = 'Добавить привычку';
    habitIdInput.value = '';
    habitNameInput.value = '';
    habitDescriptionInput.value = '';
    habitModal.style.display = 'block';
}

// Функция для открытия модального окна редактирования привычки
async function editHabit(habitId) {
    try {
        const token = getToken();
        const habit = await habitsApi.getById(habitId, token);
        
        habitModalTitle.textContent = 'Редактировать привычку';
        habitIdInput.value = habit.id;
        habitNameInput.value = habit.name;
        habitDescriptionInput.value = habit.description || '';
        habitModal.style.display = 'block';
    } catch (error) {
        console.error('Ошибка при получении данных привычки:', error);
    }
}

// Функция для удаления привычки
async function deleteHabit(habitId) {
    if (!confirm('Вы уверены, что хотите удалить эту привычку?')) {
        return;
    }
    
    try {
        const token = getToken();
        await habitsApi.delete(habitId, token);
        habits = habits.filter(habit => habit.id !== habitId);
        renderHabits();
        updateCalendar(); // Обновляем календарь после удаления привычки
    } catch (error) {
        console.error('Ошибка при удалении привычки:', error);
    }
}

// Функция для закрытия модального окна
function closeModal() {
    habitModal.style.display = 'none';
}

// Обработчик отправки формы привычки
habitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const habitData = {
        name: habitNameInput.value,
        description: habitDescriptionInput.value || null
    };
    
    const token = getToken();
    const habitId = habitIdInput.value;
    
    if (!habitNameInput.value.trim()) {
        alert('Пожалуйста, укажите название привычки');
        return;
    }

    try {
        if (habitId) {
            // Редактирование существующей привычки
            await habitsApi.update(habitId, habitData, token);
            const index = habits.findIndex(h => h.id === habitId);
            if (index !== -1) {
                habits[index] = { ...habits[index], ...habitData };
            }
        } else {
            // Создание новой привычки
            const newHabit = await habitsApi.create(habitData, token);
            habits.push(newHabit);
        }
        
        renderHabits();
        closeModal();
    } catch (error) {
        console.error('Ошибка при сохранении привычки:', error);
        alert(`Ошибка сохранения: ${error.message}`);
    }
});

// Обработчики событий
addHabitBtn.addEventListener('click', openAddHabitModal);
closeModalBtn.addEventListener('click', closeModal);
cancelHabitBtn.addEventListener('click', closeModal);

// Закрытие модального окна при клике вне его содержимого
window.addEventListener('click', (e) => {
    if (e.target === habitModal) {
        closeModal();
    }
});

// Загрузка привычек при инициализации приложения
function loadUserData() {
    loadHabits();
}