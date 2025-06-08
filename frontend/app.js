let currentUser = null;

async function initApp() {
    if (isAuthenticated()) {
        await loadUserData();
    }
    initEventListeners();
}

function loadUserData() {
    loadHabits().then(() => {
        loadAllMarks();
    }).catch(err => console.error('Ошибка при загрузке данных:', err));
}

function initEventListeners() {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        }
    });

    const metricsBtn = document.getElementById('metrics-btn');
    const metricsModal = document.getElementById('metrics-modal');
    const metricsClose = metricsModal.querySelector('.close');
    const metricsCloseBtn = document.getElementById('close-metrics');

    metricsBtn.addEventListener('click', showMetrics);
    metricsClose.addEventListener('click', () => metricsModal.style.display = 'none');
    metricsCloseBtn.addEventListener('click', () => {
        metricsCloseBtn.classList.add('clicked');
        setTimeout(() => metricsCloseBtn.classList.remove('clicked'), 300);
        metricsModal.style.display = 'none';
    });
    metricsModal.addEventListener('click', e => { if (e.target === metricsModal) metricsModal.style.display = 'none'; });
}

async function showMetrics() {
    const list = document.getElementById('metrics-list');
    list.innerHTML = '';
    try {
        const data = await profileApi.getMetrics(getToken());
        const titles = {
            total_habits: 'Всего привычек',
            archived_habits: 'В архиве',
            completed_habits: 'Завершено',
            active_habits: 'Активно',
            marks_total: 'Всего отметок',
            marks_today: 'Отметок сегодня'
        };
        Object.entries(data).forEach(([k,v]) => {
            const li = document.createElement('li');
            li.className = 'metric-item';
            li.textContent = `${titles[k] || k}: ${v}`;
            list.appendChild(li);
        });
        document.getElementById('metrics-modal').style.display = 'block';
    } catch (e) {
        alert(e.message);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
