/* dashboard.js — управление заявками в localStorage
   Tickets stored per user under key tickets_<username>
   Functions: loadTickets, renderTickets, createTicket, logout
*/

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
        // redirect to login if not authenticated
        // allow viewing index, but dashboard requires login
        if (location.pathname.endsWith('dashboard.html')) {
            // redirect to login in same folder
            window.location.href = 'login.html';
            return;
        }
    }

    // If on dashboard page - initialize
    const ticketsContainer = document.getElementById('ticketsContainer');
    const newTicketForm = document.getElementById('newTicketForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Set welcome name in dashboard if present
    const welcomeEl = document.getElementById('welcomeName');
    if (welcomeEl && currentUser) {
        // Use translation if available
        const lang = localStorage.getItem('lang') || 'ru';
        const dict = (window.I18N && window.I18N.translations && window.I18N.translations[lang]) ? window.I18N.translations[lang] : null;
        const prefix = dict && dict['welcome.message'] ? dict['welcome.message'] : 'Добро пожаловать, ';
        welcomeEl.textContent = `${prefix}${currentUser.full_name || currentUser.username}!`;
    }

    // Bind header logout (if exists)
    const logoutHeader = document.getElementById('logoutBtnHeader');
    if (logoutHeader) {
        logoutHeader.addEventListener('click', () => { localStorage.removeItem('currentUser'); window.location.href = 'index.html'; });
    }

    function loadTickets() {
        if (!currentUser) return [];
        return JSON.parse(localStorage.getItem(`tickets_${currentUser.username}`) || '[]');
    }

    function saveTickets(tickets) {
        if (!currentUser) return;
        localStorage.setItem(`tickets_${currentUser.username}`, JSON.stringify(tickets));
    }

    function renderTickets() {
        if (!ticketsContainer) return;
        const tickets = loadTickets();
        if (tickets.length === 0) { ticketsContainer.innerHTML = '<p class="text-muted p-4">У вас пока нет заявок</p>'; return; }
        const rows = tickets.map(t => `
      <tr data-id="${t.id}">
        <td>${t.id}</td>
        <td>${t.title}</td>
        <td>${t.status}</td>
        <td>${t.priority}</td>
        <td>${new Date(t.createdAt).toLocaleString()}</td>
      </tr>
    `).join('\n');
        ticketsContainer.innerHTML = `<table class="table"><thead><tr><th>#</th><th>Тема</th><th>Статус</th><th>Приоритет</th><th>Создано</th></tr></thead><tbody>${rows}</tbody></table>`;
    }

    if (newTicketForm) {
        newTicketForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = (newTicketForm.querySelector('[name="title"]') || {}).value?.trim();
            const description = (newTicketForm.querySelector('[name="description"]') || {}).value?.trim();
            const priority = (newTicketForm.querySelector('[name="priority"]') || {}).value || 'medium';
            if (!title || !description) {
                const lang = localStorage.getItem('lang') || 'ru';
                const dict = (window.I18N && window.I18N.translations && window.I18N.translations[lang]) ? window.I18N.translations[lang] : null;
                const msg = dict && dict['ticket.fill'] ? dict['ticket.fill'] : 'Заполните тему и описание';
                alert(msg); return;
            }
            const tickets = loadTickets();
            const id = tickets.length ? (tickets[tickets.length - 1].id + 1) : 1;
            const ticket = { id, title, description, priority, status: 'new', createdAt: Date.now() };
            tickets.push(ticket);
            saveTickets(tickets);
            const lang2 = localStorage.getItem('lang') || 'ru';
            const dict2 = (window.I18N && window.I18N.translations && window.I18N.translations[lang2]) ? window.I18N.translations[lang2] : null;
            const ok = dict2 && dict2['ticket.created'] ? dict2['ticket.created'] : 'Заявка создана';
            alert(ok);
            newTicketForm.reset();
            renderTickets();
        });
    }

    if (logoutBtn) { logoutBtn.addEventListener('click', () => { localStorage.removeItem('currentUser'); window.location.href = 'index.html'; }); }

    renderTickets();
});
