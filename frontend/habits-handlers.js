// Обработчики событий для работы с привычками

// Получение элементов DOM
const addHabitBtn = document.getElementById('add-habit-btn');
const habitModal = document.getElementById('habit-modal');
const habitForm = document.getElementById('habit-form');
const habitsList = document.getElementById('habits-list');
const closeModalBtn = document.querySelector('.modal-content .close');
const cancelHabitBtn = document.getElementById('cancel-habit');

// Глобальные переменные
let habits = [];
let editingHabitId = null;

// Функция для загрузки привычек пользователя
async function loadHabits() {
    try {
        const token = getToken();
        habits = await habitsApi.getAll(token);
        renderHabits();
        
        // Загружаем отметки для календаря, если функция существует
        if (typeof loadAllMarks === 'function') {
            loadAllMarks();
        }
    } catch (error) {
        console.error('Ошибка при загрузке привычек:', error);
        alert('Ошибка при загрузке привычек: ' + error.message);
    }
}

// Функция для отображения привычек в списке
function renderHabits() {
    habitsList.innerHTML = '';
    
    if (habits.length === 0) {
        habitsList.innerHTML = '<div class="empty-state">У вас пока нет привычек. Нажмите "Добавить", чтобы создать первую привычку.</div>';
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
                <button class="btn icon-btn edit-habit" data-id="${habit.id}"><i class="fas fa-edit"></i></button>
                <button class="btn icon-btn delete-habit" data-id="${habit.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        habitsList.appendChild(habitElement);
        
        // Добавляем обработчики для кнопок редактирования и удаления
        habitElement.querySelector('.edit-habit').addEventListener('click', () => editHabit(habit.id));
        habitElement.querySelector('.delete-habit').addEventListener('click', () => deleteHabit(habit.id));
    });
}

// Функция для открытия модального окна добавления привычки
function openAddHabitModal() {
    // Сбрасываем форму и ID редактируемой привычки
    habitForm.reset();
    document.getElementById('habit-id').value = '';
    document.getElementById('habit-modal-title').textContent = 'Добавить привычку';
    editingHabitId = null;
    
    // Отображаем модальное окно
    habitModal.style.display = 'block';
}

// Функция для открытия модального окна редактирования привычки
async function editHabit(habitId) {
    try {
        editingHabitId = habitId;
        const token = getToken();
        const habit = await habitsApi.getById(habitId, token);
        
        // Заполняем форму данными привычки
        document.getElementById('habit-id').value = habit.id;
        document.getElementById('habit-name').value = habit.name;
        document.getElementById('habit-description').value = habit.description || '';
        document.getElementById('habit-modal-title').textContent = 'Редактировать привычку';
        
        // Отображаем модальное окно
        habitModal.style.display = 'block';
    } catch (error) {
        console.error('Ошибка при загрузке привычки для редактирования:', error);
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
        
        // Обновляем список привычек
        habits = habits.filter(habit => habit.id !== habitId);
        renderHabits();
    } catch (error) {
        console.error('Ошибка при удалении привычки:', error);
        alert('Не удалось удалить привычку. Попробуйте еще раз.');
    }
}

// Обработчик отправки формы привычки
habitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const habitName = document.getElementById('habit-name').value;
    const habitDescription = document.getElementById('habit-description').value;
    
    const habitData = {
        name: habitName,
        description: habitDescription
    };
    
    try {
        const token = getToken();
        
        if (editingHabitId) {
            // Обновляем существующую привычку
            await habitsApi.update(editingHabitId, habitData, token);
        } else {
            // Создаем новую привычку
            const newHabit = await habitsApi.create(habitData, token);
            habits.push(newHabit);
        }
        
        // Закрываем модальное окно и обновляем список привычек
        habitModal.style.display = 'none';
        loadHabits();
    } catch (error) {
        console.error('Ошибка при сохранении привычки:', error);
        alert('Не удалось сохранить привычку. Попробуйте еще раз.');
    }
});

// Обработчик нажатия на кнопку добавления привычки
addHabitBtn.addEventListener('click', openAddHabitModal);

// Обработчики закрытия модального окна
closeModalBtn.addEventListener('click', () => {
    habitModal.style.display = 'none';
});

cancelHabitBtn.addEventListener('click', () => {
    habitModal.style.display = 'none';
});

// Загружаем привычки при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated()) {
        loadHabits();
    }
});

// Функция для загрузки данных пользователя
function loadUserData() {
    loadHabits();
}