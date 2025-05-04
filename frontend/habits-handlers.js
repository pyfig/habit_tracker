// Управление привычками на фронтенде
const habitsList = document.getElementById('habits-list');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitForm = document.getElementById('habit-form');
const habitModal = document.getElementById('habit-modal');
const modalCloseBtn = habitModal.querySelector('.close');
const cancelHabitBtn = document.getElementById('cancel-habit');
const archiveBtn = document.getElementById('archive-btn');
const archiveModal = document.getElementById('archive-modal');
const archivedList = document.getElementById('archived-list');
const closeArchiveBtn = document.getElementById('close-archive');

const confirmArchiveModal = document.getElementById('confirm-archive-modal');
const confirmArchiveBtn   = document.getElementById('confirm-archive');
const cancelArchiveBtn    = document.getElementById('cancel-archive');

let habits = [];
let archiveTargetId = null;

// Утилиты для работы с модалками
function showModal(modal) { modal.style.display = 'block'; }
function hideModal(modal) { modal.style.display = 'none'; }
function formatDate(date) { return date.toISOString().slice(0,10); }

// Открытие/закрытие Habit-модалки
function openHabitModal(editingId = null) {
  habitForm.reset();
  delete habitForm.dataset.editing;
  document.getElementById('habit-modal-title').textContent = editingId ? 'Редактировать привычку' : 'Добавить привычку';
  if (editingId) habitForm.dataset.editing = editingId;
  showModal(habitModal);
}
function closeHabitModal() { hideModal(habitModal); }

// Confirm-модалка архивирования
function showConfirmArchive(id) {
  archiveTargetId = id;
  showModal(confirmArchiveModal);
}
confirmArchiveBtn.addEventListener('click', async () => {
  try {
    await habitsApi.archive(archiveTargetId, getToken());
    await loadHabits();
  } catch (e) { console.error(e); }
  hideModal(confirmArchiveModal);
  archiveTargetId = null;
});
cancelArchiveBtn.addEventListener('click', () => { hideModal(confirmArchiveModal); archiveTargetId = null; });
confirmArchiveModal.addEventListener('click', e => { if (e.target===confirmArchiveModal) hideModal(confirmArchiveModal); });

// Открытие/закрытие Archive-модалки
archiveBtn.addEventListener('click', async () => { showModal(archiveModal); await loadArchivedHabits(getToken()); });
closeArchiveBtn.addEventListener('click', () => hideModal(archiveModal));
archiveModal.addEventListener('click', e => { if (e.target===archiveModal) hideModal(archiveModal); });

// Загрузка привычек и архива
async function loadHabits() {
  try {
    const token = getToken();
    const all = await habitsApi.getAll(token);
    habits = all.filter(h=>!h.archived);
    renderHabits(); renderCompletedToday();
    await loadArchivedHabits(token);
  } catch (e) { console.error(e); }
}
async function loadArchivedHabits(token) {
  try {
    const archived = await habitsApi.getArchived(token);
    renderArchivedHabits(archived);
  } catch (e) { console.error(e); }
}

// Рендер активных привычек
function renderHabits() {
  habitsList.innerHTML='';
  const today=formatDate(new Date());
  const active=habits.filter(h=>!(allMarks[h.id]||[]).some(m=>m.date===today));
  if(!active.length){ habitsList.innerHTML='<div class="empty-state">Добавьте привычку!</div>'; return; }
  active.forEach(h=>{
    const el=document.createElement('div'); el.className='habit-item';
    el.innerHTML=`
      <div class="habit-info">
        <h3>${h.name}</h3>
        <p>${h.description||''}</p>
      </div>
      <div class="habit-actions">
        <button class="btn icon-btn edit-habit" data-id="${h.id}" title="Редактировать"><i class="fas fa-edit"></i></button>
        <button class="btn icon-btn archive-habit" data-id="${h.id}" title="Архивировать"><i class="fas fa-archive"></i></button>
        <button class="btn icon-btn delete-habit" data-id="${h.id}" title="Удалить"><i class="fas fa-trash"></i></button>
        <button class="btn icon-btn complete-habit" data-id="${h.id}" title="Отметить выполненной сегодня"><i class="fa-solid fa-circle-check"></i></button>
      </div>`;
    habitsList.append(el);
    el.querySelector('.edit-habit').addEventListener('click',()=>openHabitModal(h.id));
    el.querySelector('.archive-habit').addEventListener('click',()=>showConfirmArchive(h.id));
    el.querySelector('.delete-habit').addEventListener('click',()=>deleteHabit(h.id));
    el.querySelector('.complete-habit').addEventListener('click',()=>completeHabit(h.id));
  });
}

// Рендер архива
function renderArchivedHabits(list) {
  archivedList.innerHTML=list.map(h=>`<li class="archived-item"><span>${h.name}</span>
    <button class="btn recover-btn" data-id="${h.id}">Восстановить</button></li>`).join('');
  archivedList.querySelectorAll('.recover-btn').forEach(b=>b.addEventListener('click',()=>recoverHabit(b.dataset.id)));
}

// Восстановление
async function recoverHabit(id) {
  try{ await habitsApi.restore(id,getToken()); await loadHabits(); hideModal(archiveModal);} catch(e){console.error(e);} }



// Удаление привычки
async function deleteHabit(habitId) {
  if (!confirm('Удалить эту привычку?')) return;
  try {
    await habitsApi.delete(habitId,getToken());
    habits = habits.filter(h=>h.id!==habitId);
    renderHabits(); renderCompletedToday();
  } catch(e) {console.error(e);} 
}

// Завершение привычки
async function completeHabit(habitId) {
  try {
    const today = formatDate(new Date());
    await marksApi.create({ habit_id: habitId, date: today }, getToken());
    await loadAllMarks(); renderHabits(); renderCompletedToday();
  } catch (e) { console.error(e); }
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
    renderHabits(); renderCompletedToday();
    closeHabitModal();
  } catch (e) {
    console.error('Ошибка при добавлении привычки:', e);
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
    renderHabits(); renderCompletedToday();
    closeHabitModal();
  } catch (e) {
    console.error('Ошибка при обновлении привычки:', e);
  }
}

// Обработчики формы добавления/редактирования
habitForm.addEventListener('submit', event => {
  event.preventDefault();
  const editingId = habitForm.dataset.editing;
  if (editingId) updateHabit(editingId);
  else addHabit();
});

function createHabitElement(habit) {
    const habitElement = document.createElement("div");
    habitElement.textContent = habit.name;

    if (habit.is_done) {
        const restoreButton = document.createElement("button");
        restoreButton.textContent = "Вернуть";
        restoreButton.onclick = async () => {
            // ("/{habit_id}/restore",
            await fetch(`/${habit.id/restore}`, { method: "POST" });
            loadHabits(); // перезагрузка списка
        };
        habitElement.appendChild(restoreButton);
    }

    return habitElement;
}


// Кнопки открытия/закрытия Habit-модалки
addHabitBtn.addEventListener('click', () => openHabitModal());
modalCloseBtn.addEventListener('click', closeHabitModal);
cancelHabitBtn.addEventListener('click', closeHabitModal);
window.addEventListener('click', event => { if (event.target === habitModal) closeHabitModal(); });
