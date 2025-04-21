// Управление календарем отметок

// Получение элементов
const calendarElement = document.getElementById('calendar');
const currentMonthElement = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

// Глобальные переменные
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let allMarks = {}; // Объект для хранения отметок по привычкам

// Названия месяцев
const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// Названия дней недели
const weekdayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Функция для загрузки отметок для всех привычек
async function loadAllMarks() {
    try {
        const token = getToken();
        allMarks = {};
        
        // Загружаем отметки для каждой привычки
        for (const habit of habits) {
            const marks = await marksApi.getByHabit(habit.id, token);
            allMarks[habit.id] = marks;
        }
        
        renderCalendar();
    } catch (error) {
        console.error('Ошибка при загрузке отметок:', error);
    }
}

// Функция для получения дней в месяце
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// Функция для получения первого дня месяца (0 - воскресенье, 1 - понедельник, ...)
function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Преобразуем для начала недели с понедельника
}

// Функция для форматирования даты в строку YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Функция для проверки, есть ли отметка на определенную дату
function hasMarkOnDate(date) {
    const dateStr = formatDate(date);
    
    // Проверяем все привычки
    for (const habitId in allMarks) {
        const habitMarks = allMarks[habitId];
        if (habitMarks.some(mark => mark.date === dateStr)) {
            return true;
        }
    }
    
    return false;
}

// Функция для отображения календаря
function renderCalendar() {
    // Обновляем заголовок с текущим месяцем и годом
    currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Очищаем календарь
    calendarElement.innerHTML = '';
    
    // Добавляем заголовки дней недели
    weekdayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-header';
        dayElement.textContent = day;
        calendarElement.appendChild(dayElement);
    });
    
    // Получаем количество дней в текущем месяце и первый день месяца
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < firstDay; i++) {
        const prevMonthDate = new Date(currentYear, currentMonth, 0 - (firstDay - i - 1));
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = prevMonthDate.getDate();
        calendarElement.appendChild(dayElement);
    }
    
    // Добавляем дни текущего месяца
    const today = new Date();
    const todayDate = formatDate(today);
    
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const dateStr = formatDate(date);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;
        dayElement.setAttribute('data-date', dateStr);
        
        // Отмечаем сегодняшний день
        if (dateStr === todayDate) {
            dayElement.classList.add('today');
        }
        
        // Отмечаем дни с отметками
        if (hasMarkOnDate(date)) {
            dayElement.classList.add('marked');
        }
        
        // Добавляем обработчик клика для добавления/удаления отметки
        dayElement.addEventListener('click', () => toggleMark(dateStr));
        
        calendarElement.appendChild(dayElement);
    }
    
    // Добавляем пустые ячейки для дней следующего месяца
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    
    for (let i = 1; i <= remainingCells; i++) {
        const nextMonthDate = new Date(currentYear, currentMonth + 1, i);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = i;
        calendarElement.appendChild(dayElement);
    }
}

// Функция для переключения на предыдущий месяц
function goToPrevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

// Функция для переключения на следующий месяц
function goToNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// Функция для добавления или удаления отметки
async function toggleMark(dateStr) {
    // Если нет выбранной привычки, показываем сообщение
    if (habits.length === 0) {
        alert('Сначала создайте привычку');
        return;
    }
    
    // Если есть только одна привычка, используем ее
    // Иначе показываем диалог выбора привычки
    let selectedHabitId;
    
    if (habits.length === 1) {
        selectedHabitId = habits[0].id;
    } else {
        // Создаем список привычек для выбора
        const habitOptions = habits.map(habit => 
            `<option value="${habit.id}">${habit.name}</option>`
        ).join('');
        
        const habitSelector = document.createElement('div');
        habitSelector.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1001;">
                <div style="background: white; padding: 20px; border-radius: 8px; max-width: 400px;">
                    <h3>Выберите привычку</h3>
                    <select id="habit-selector" style="width: 100%; padding: 8px; margin: 10px 0;">
                        ${habitOptions}
                    </select>
                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button id="cancel-select" style="padding: 8px 15px;">Отмена</button>
                        <button id="confirm-select" style="padding: 8px 15px; background: var(--primary-color); color: white; border: none; border-radius: 4px;">Выбрать</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(habitSelector);
        
        // Обработчики для кнопок
        return new Promise((resolve) => {
            document.getElementById('cancel-select').addEventListener('click', () => {
                document.body.removeChild(habitSelector);
                resolve(null);
            });
            
            document.getElementById('confirm-select').addEventListener('click', () => {
                const selectedId = document.getElementById('habit-selector').value;
                document.body.removeChild(habitSelector);
                resolve(selectedId);
            });
        }).then(async (habitId) => {
            if (habitId) {
                await processMarkToggle(habitId, dateStr);
            }
        });
    }
    
    if (selectedHabitId) {
        await processMarkToggle(selectedHabitId, dateStr);
    }
}

// Функция для обработки добавления/удаления отметки
async function processMarkToggle(habitId, dateStr) {
    try {
        const token = getToken();
        const habitMarks = allMarks[habitId] || [];
        
        // Проверяем, есть ли уже отметка на эту дату
        const existingMark = habitMarks.find(mark => mark.date === dateStr);
        
        if (existingMark) {
            // Удаляем отметку
            await marksApi.delete(existingMark.id, token);
            allMarks[habitId] = habitMarks.filter(mark => mark.id !== existingMark.id);
        } else {
            // Добавляем отметку
            const newMark = await marksApi.create({
                habit_id: habitId,
                date: dateStr
            }, token);
            
            if (!allMarks[habitId]) {
                allMarks[habitId] = [];
            }
            
            allMarks[habitId].push(newMark);
        }
        
        renderCalendar();
    } catch (error) {
        console.error('Ошибка при обновлении отметки:', error);
    }
}

// Обработчики событий для кнопок переключения месяцев
prevMonthBtn.addEventListener('click', goToPrevMonth);
nextMonthBtn.addEventListener('click', goToNextMonth);

// Функция для обновления календаря
function updateCalendar() {
    loadAllMarks();
}

// Инициализация календаря при загрузке страницы
renderCalendar();