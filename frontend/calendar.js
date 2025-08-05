const calendarElement = document.getElementById('calendar');
const currentMonthElement = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let allMarks = {};

const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const weekdayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

async function loadAllMarks() {
    try {
        const token = getToken();
        allMarks = {};
        if (!habits || habits.length === 0) {
             console.warn("loadAllMarks: Массив habits пуст или не загружен.");
        }

        console.log("Загрузка отметок для привычек:", habits); 
        for (const habit of habits) {
            console.log(`Запрос отметок для habit.id: ${habit.id}`); 
            const marks = await marksApi.getByHabit(habit.id, token);
            console.log(`Получены отметки для ${habit.id}:`, marks); 
            allMarks[habit.id] = marks;
        }
        console.log("Финальный объект allMarks:", allMarks);

        renderCalendar();       
        renderCompletedToday(); 
        renderHabits();         

    } catch (error) {
        console.error('Ошибка при загрузке отметок (loadAllMarks):', error); 
        console.error(error);
        alert('Не удалось загрузить отметки.');
    }
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function hasMarkOnDate(date) {
    const dateStr = formatDate(date);
    
    for (const habitId in allMarks) {
        const habitMarks = allMarks[habitId];
        if (habitMarks.some(mark => mark.date === dateStr)) {
            return true;
        }
    }
    
    return false;
}

function renderCalendar() {
    currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    calendarElement.innerHTML = '';
    
    weekdayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-header';
        dayElement.textContent = day;
        calendarElement.appendChild(dayElement);
    });
    
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    for (let i = 0; i < firstDay; i++) {
        const prevMonthDate = new Date(currentYear, currentMonth, 0 - (firstDay - i - 1));
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = prevMonthDate.getDate();
        calendarElement.appendChild(dayElement);
    }
    
    const today = new Date();
    const todayDate = formatDate(today);
    
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const dateStr = formatDate(date);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;
        dayElement.setAttribute('data-date', dateStr);
        if (dateStr === todayDate) {
            dayElement.classList.add('today');
        }
        if (hasMarkOnDate(date)) {
            dayElement.classList.add('marked');
        }

        dayElement.addEventListener('click', () => showDateHabits(dateStr));
        calendarElement.appendChild(dayElement);
    }
    
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

function renderCompletedToday() {
    const todayStr = formatDate(new Date());
    const listEl = document.getElementById('completed-today-list');
    listEl.innerHTML = '';

    const doneHabits = habits.filter(habit => {
        const marks = allMarks[habit.id] || [];
        return marks.some(mark => mark.date === todayStr);
    });

    if (doneHabits.length === 0) {
        listEl.innerHTML = '<li>Нет выполненных привычек</li>';
    } else {
        doneHabits.forEach(habit => {
            const container = document.createElement('div');
            container.classList.add('habit-item');
            
            const title = document.createElement('span');
            title.classList.add('habit-title');
            title.textContent = habit.name;
            container.appendChild(title);

            const btn = document.createElement('button');
            btn.textContent = 'Вернуть';
            btn.classList.add('recover-btn');
            btn.style.marginLeft = 'auto';
            btn.addEventListener('click', async () => {
                const token = getToken();
                await habitsApi.uncomplete(habit.id, token);
                const mark = (allMarks[habit.id] || []).find(m => m.date === todayStr);
                if (mark) {
                    await marksApi.delete(mark.id, token);
                }
                await loadAllMarks();
                await loadHabits();
            });
            container.appendChild(btn);

            listEl.appendChild(container);
        });
    }
}

function toggleTodayMark() {
    const today = formatDate(new Date());
    const todayElement = document.querySelector(`.calendar-day[data-date="${today}"]`);

    if (todayElement) {
        todayElement.classList.toggle('marked');
    }
}

function showDateHabits(dateStr) {
    const modal = document.getElementById('date-modal');
    const title = document.getElementById('date-title');
    const list = document.getElementById('date-habits-list');
    title.textContent = dateStr;
    list.innerHTML = '';
    habits.forEach(h => {
        const li = document.createElement('li');
        li.className = 'metric-item';
        const done = (allMarks[h.id] || []).some(m => m.date === dateStr);
        if (done) li.classList.add('done');
        li.textContent = done ? `${h.name} — выполнено` : h.name;
        list.appendChild(li);
    });
    modal.style.display = 'block';
    const close = modal.querySelector('.close');
    close.onclick = () => modal.style.display = 'none';
    modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
}

function goToPrevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function goToNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

async function toggleMark(dateStr) {
    if (habits.length !== 1) {
        return;
    }

    const selectedHabitId = habits[0].id;
    await processMarkToggle(selectedHabitId, dateStr);
}

async function processMarkToggle(habitId, dateStr) {
    try {
        const token = getToken();
        const habitMarks = allMarks[habitId] || [];
        
        const existingMark = habitMarks.find(mark => mark.date === dateStr);
        
        if (existingMark) {
            await marksApi.delete(existingMark.id, token);
            allMarks[habitId] = habitMarks.filter(mark => mark.id !== existingMark.id);
        } else {
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

prevMonthBtn.addEventListener('click', goToPrevMonth);
nextMonthBtn.addEventListener('click', goToNextMonth);

function updateCalendar() {
    loadAllMarks();
}

renderCalendar();