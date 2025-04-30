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
        habits = habits.filter(h => !h.archived && !h.completed);
        // renderHabits();
        // renderCompletedToday();
    } catch (error) {
        console.error('Ошибка при загрузке привычек:', error);
    }
}

async function loadArchivedHabits() {
    try {
        const token = getToken();
        const archived = await habitsApi.getArchived(token);
        renderArchivedHabits(archived);
    } catch (error) {
        console.error('Ошибка загрузки архивных привычек:', error);
    }
}

function renderArchivedHabits(archivedHabits) {
    const list = document.getElementById('archived-habits-list');
    list.innerHTML = '';
    
    if (archivedHabits.length === 0) {
        list.innerHTML = '<li class="archived-item">Архив пуст</li>';
        return;
    }

    archivedHabits.forEach(habit => {
        const li = document.createElement('li');
        li.className = 'archived-item';
        li.innerHTML = `
            <span>${habit.name}</span>
            <button class="btn icon-btn recover-habit" data-id="${habit.id}" title="Восстановить"><i class="fas fa-undo"></i></button>
        `;
        li.querySelector('.recover-habit').addEventListener('click', () => recoverHabit(habit.id));
        list.appendChild(li);
    });
}

async function recoverHabit(habitId) {
    if (!confirm('Восстановить привычку из архива?')) return;
    try {
        const token = getToken();
        await habitsApi.update(habitId, { archived: false }, token);
        // Обновляем список
        await Promise.all([loadHabits(), loadArchivedHabits()]);
        renderHabits();
    } catch (error) {
        console.error('Ошибка восстановления привычки:', error);
        alert('Не удалось восстановить привычку');
    }
}

// Отображение списка привычек
function renderHabits() {
    // Получаем ссылку на элемент списка привычек
    const habitsList = document.getElementById('habits-list');
    // Очищаем текущий список
    habitsList.innerHTML = '';
    const todayStr = formatDate(new Date());

    // Фильтруем массив 'habits' (глобальный или доступный в этой области видимости)
    // Оставляем только те привычки, которые НЕ архивированы и для которых НЕТ отметки о выполнении сегодня
    const activeHabitsToday = habits.filter(habit => {
        // Проверяем, не архивирована ли привычка
        if (habit.archived) {
            return false; // Исключаем архивированные
        }
        // Получаем массив отметок для текущей привычки из глобального объекта allMarks
        // Если отметок нет, используем пустой массив
        const habitMarks = allMarks[habit.id] || [];
        // Проверяем, есть ли в массиве отметок хотя бы одна с сегодняшней датой
        const isCompletedToday = habitMarks.some(mark => mark.date === todayStr);
        // Возвращаем true (оставляем привычку), если она НЕ выполнена сегодня
        return !isCompletedToday;
    });

    // Проверяем, остались ли привычки для отображения после фильтрации
    if (activeHabitsToday.length === 0) {
        // Если активных привычек на сегодня нет, выводим сообщение
        habitsList.innerHTML = '<div class="empty-state">Как-то здесь пустовато... Давай добавим привычку!</div>';
        // Завершаем выполнение функции
        return;
    }

    // Проходимся по отфильтрованному массиву привычек, которые нужно отобразить
    activeHabitsToday.forEach(habit => {
        // Создаем новый div-элемент для привычки
        const habitElement = document.createElement('div');
        // Присваиваем класс для стилизации
        habitElement.className = 'habit-item';
        // Заполняем HTML-содержимое элемента данными привычки и кнопками действий
        // Важно: Используем habit.id из отфильтрованного списка для атрибутов data-id
        habitElement.innerHTML = `
            <div class="habit-info">
                <h3>${habit.name}</h3>
                <p>${habit.description || ''}</p>
            </div>
            <div class="habit-actions">
                <button class="btn icon-btn edit-habit" data-id="${habit.id}" title="Редактировать"><i class="fas fa-edit"></i></button>
                <button class="btn icon-btn archive-habit" data-id="${habit.id}" title="Архивировать"><i class="fas fa-archive"></i></button>
                <button class="btn icon-btn delete-habit" data-id="${habit.id}" title="Удалить"><i class="fas fa-trash"></i></button>
                <button class="btn icon-btn complete-habit" data-id="${habit.id}" title="Отметить выполненной сегодня"><i class="fa-solid fa-circle-check"></i></button>
            </div>
        `;

        // Добавляем созданный элемент привычки в список на странице
        habitsList.appendChild(habitElement);

        // "Отметить выполненной"
        habitElement.querySelector('.complete-habit').addEventListener('click', () => completeHabit(habit.id));
        // "Редактировать"
        habitElement.querySelector('.edit-habit').addEventListener('click', () => openHabitModal(habit.id));
        // "Удалить"
        habitElement.querySelector('.delete-habit').addEventListener('click', () => deleteHabit(habit.id));
        // "Архивировать"
        habitElement.querySelector('.archive-habit').addEventListener('click', () => archiveHabit(habit.id));
    });
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

async function renderCompletedToday() {
    const todayStr = formatDate(new Date());
    const completedList = document.getElementById('completed-today-list');
    completedList.innerHTML = '';
    
    // Получаем привычки с отметками на сегодня
    const doneHabits = habits.filter(habit => {
        const habitMarks = allMarks[habit.id] || [];
        return habitMarks.some(mark => mark.date === todayStr);
    });

    if (doneHabits.length === 0) {
        completedList.innerHTML = '<li>Нет выполненных привычек</li>';
    } else {
        doneHabits.forEach(habit => {
            const li = document.createElement('li');
            li.textContent = habit.name;
            completedList.appendChild(li);
        });
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
    try {
        const token = getToken();
        const todayStr = formatDate(new Date());
        

        await marksApi.create({ habit_id: habitId, date: todayStr }, token);
        
        // Обновляем локальные данные
        const habit = habits.find(h => h.id === habitId);
        if (habit) habit.completed = true;
        
        // Перезагружаем данные
        await loadAllMarks();
        renderHabits();
        renderCompletedToday();
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось выполнить привычку');
    }
}

