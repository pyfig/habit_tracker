// frontend/calendar.js

const Calendar = {
    // DOM Elements
    calendarEl: document.getElementById('calendar'),
    monthLabel: document.getElementById('current-month'),
    prevBtn: document.getElementById('prev-month'),
    nextBtn: document.getElementById('next-month'),
    completedListEl: document.getElementById('completed-today-list'),
  
    // State
    today: new Date(),
    currentMonth: null,
    currentYear: null,
    marksByHabit: {},    // { habitId: [ { id, date }, … ] }
    habits: [],          // глобальный массив habits должен быть заполнен до init()
  
    // Constants
    monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    weekdayNames: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
  
    init() {
      const d = new Date();
      this.currentMonth = d.getMonth();
      this.currentYear = d.getFullYear();
  
      this.prevBtn.addEventListener('click', () => this.changeMonth(-1));
      this.nextBtn.addEventListener('click', () => this.changeMonth(+1));
  
      // load marks and render
      this.loadAllMarks();
    },
  
    async loadAllMarks() {
      try {
        const token = getToken();
        this.marksByHabit = {};
        // assume global habits array is populated
        await Promise.all(this.habits.map(async habit => {
          const marks = await marksApi.getByHabit(habit.id, token);
          this.marksByHabit[habit.id] = marks;
        }));
        this.render();
      } catch (err) {
        console.error('Ошибка при загрузке отметок:', err);
      }
    },
  
    render() {
      this.renderCalendar();
      this.renderCompletedToday();
    },
  
    renderCalendar() {
      this.monthLabel.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
      this.calendarEl.innerHTML = '';
  
      // weekday headers
      this.weekdayNames.forEach(w => {
        const hd = document.createElement('div');
        hd.className = 'calendar-header';
        hd.textContent = w;
        this.calendarEl.appendChild(hd);
      });
  
      const daysInMonth = new Date(this.currentYear, this.currentMonth+1,0).getDate();
      const startOffset = (new Date(this.currentYear, this.currentMonth,1).getDay()+6)%7;
  
      // blank cells
      for(let i=0; i<startOffset; i++){
        const cell = document.createElement('div');
        cell.className = 'calendar-day other-month';
        this.calendarEl.appendChild(cell);
      }
  
      // days
      const todayStr = this.formatDate(this.today);
      for(let d=1; d<=daysInMonth; d++){
        const date = new Date(this.currentYear, this.currentMonth, d);
        const dateStr = this.formatDate(date);
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        cell.textContent = d;
        cell.dataset.date = dateStr;
  
        if(dateStr===todayStr) cell.classList.add('today');
        if(this.hasMark(dateStr)) cell.classList.add('marked');
        if(date>this.today) {
          cell.classList.add('disabled');
        } else {
          cell.addEventListener('click', () => this.toggleMark(dateStr));
        }
<<<<<<< HEAD
  
        // tooltip: habits created on this date
        cell.addEventListener('mouseover', () => {
          const added = this.habits.filter(h=>h.created_date===dateStr).map(h=>h.name);
          cell.title = added.length?`Добавлено: ${added.join(', ')}`:'';
        });
  
        this.calendarEl.appendChild(cell);
      }
  
      // trailing blanks
      const totalCells = Math.ceil((startOffset+daysInMonth)/7)*7;
      for(let i= startOffset+daysInMonth; i< totalCells; i++){
        const cell = document.createElement('div');
        cell.className = 'calendar-day other-month';
        this.calendarEl.appendChild(cell);
      }
    },
  
    renderCompletedToday() {
      const todayStr = this.formatDate(this.today);
      this.completedListEl.innerHTML = '';
      const done = this.habits.filter(h=>{
        const marks = this.marksByHabit[h.id]||[];
        return marks.some(m=>m.date===todayStr);
      });
      if(!done.length) {
        this.completedListEl.innerHTML = '<li>Нет выполненных привычек</li>';
        return;
      }
      done.forEach(h=>{
        const li = document.createElement('li');
        li.textContent = h.name;
  
        const btn = document.createElement('button');
        btn.textContent = 'Архивировать';
        btn.className = 'archive-today-btn';
        btn.addEventListener('click', ()=> this.archiveHabit(h.id, h.name));
        li.appendChild(btn);
  
        this.completedListEl.appendChild(li);
      });
    },
  
    async archiveHabit(habitId, habitName) {
      if(!confirm(`Архивировать «${habitName}»?`)) return;
      try {
=======
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
// файл: frontend/calendar.js

// После загрузки отметок обновляем календарь и список выполненных сегодня
async function loadAllMarks() {
    try {
        const token = getToken();
        allMarks = {};
        for (const habit of habits) {
            const marks = await marksApi.getByHabit(habit.id, token);
            allMarks[habit.id] = marks;
        }
        renderCalendar();
        renderCompletedToday(); // Обновляем список выполненных сегодня
    } catch (error) {
        console.error('Ошибка при загрузке отметок:', error);
    }
}



// Функция для отображения списка выполненных сегодня привычек
function renderCompletedToday() {
    const todayStr = formatDate(new Date());
    const listEl = document.getElementById('completed-today-list');
    listEl.innerHTML = '';

    // Определяем привычки, у которых есть отметка на сегодняшнюю дату
    const doneHabits = habits.filter(habit => {
        const marks = allMarks[habit.id] || [];
        return marks.some(mark => mark.date === todayStr);
    });

    if (doneHabits.length === 0) {
        listEl.innerHTML = '<li>Нет выполненных привычек</li>';
    } else {
        doneHabits.forEach(habit => {
            const li = document.createElement('li');
            li.textContent = habit.name;
            listEl.appendChild(li);
        });
    }
}

function toggleTodayMark() {
    const today = formatDate(new Date()); // Сегодняшняя дата в формате строки
    const todayElement = document.querySelector(`.calendar-day[data-date="${today}"]`);

    if (todayElement) {
        todayElement.classList.toggle('marked');
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
    if (habits.length !== 1) {
        return;
    }

    const selectedHabitId = habits[0].id;
    await processMarkToggle(selectedHabitId, dateStr);
}

// файл: frontend/calendar.js

// После загрузки отметок обновляем календарь и список выполненных сегодня
async function loadAllMarks() {
    try {
        const token = getToken();
        allMarks = {};
        for (const habit of habits) {
            const marks = await marksApi.getByHabit(habit.id, token);
            allMarks[habit.id] = marks;
        }
        renderCalendar();
        renderCompletedToday(); // Обновляем список выполненных сегодня
    } catch (error) {
        console.error('Ошибка при загрузке отметок:', error);
    }
}



// Функция для обработки добавления/удаления отметки
async function processMarkToggle(habitId, dateStr) {
    try {
>>>>>>> 1b17dc0 (Added archieved and completed habits, with new api endpoint in habits py, realationships in model.py)
        const token = getToken();
        await habitsApi.archive(habitId, token);
        this.habits = this.habits.filter(h=>h.id!==habitId);
        delete this.marksByHabit[habitId];
        this.render();
      } catch(err) {
        console.error('Ошибка архивации:', err);
        showNotification('Не удалось архивировать привычку','error');
      }
    },
  
    async toggleMark(dateStr) {
      // если нужно выбор привычки, расширить здесь
      const habitId = this.habits[0]?.id;
      if(!habitId) return;
      const marks = this.marksByHabit[habitId]||[];
      const existing = marks.find(m=>m.date===dateStr);
      try {
        if(existing) {
          await marksApi.remove(existing.id);
          this.marksByHabit[habitId] = marks.filter(m=>m.id!==existing.id);
        } else {
          const newMark = await marksApi.create({habit_id:habitId, date:dateStr});
          this.marksByHabit[habitId].push(newMark);
        }
        this.renderCalendar();
        this.renderCompletedToday();
      } catch(err) {
        console.error('Ошибка при обновлении отметки:', err);
      }
    },
  
    hasMark(dateStr) {
      return Object.values(this.marksByHabit).some(arr=>arr.some(m=>m.date===dateStr));
    },
  
    formatDate(date) {
      const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,'0'), d=String(date.getDate()).padStart(2,'0');
      return `${y}-${m}-${d}`;
    },
  
    changeMonth(delta) {
      this.currentMonth += delta;
      if(this.currentMonth<0){ this.currentMonth=11; this.currentYear--; }
      if(this.currentMonth>11){ this.currentMonth=0; this.currentYear++; }
      this.renderCalendar();
    }
  };
  
  // Запуск после загрузки global habits
  document.addEventListener('DOMContentLoaded', () => Calendar.init());
  