/* auth.js — простая имитация регистрации и входа через localStorage
   Формы должны иметь id: registerForm (inputs: username,email,full_name,password1,password2)
   и loginForm (inputs: username,password)
*/

document.addEventListener('DOMContentLoaded', () => {
    // Registration
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = (regForm.querySelector('[name="username"]') || {}).value?.trim();
            const email = (regForm.querySelector('[name="email"]') || {}).value?.trim();
            const full_name = (regForm.querySelector('[name="full_name"]') || {}).value?.trim();
            const password1 = (regForm.querySelector('[name="password1"]') || {}).value || '';
            const password2 = (regForm.querySelector('[name="password2"]') || {}).value || '';

            if (!username || !email || !password1) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            if (password1 !== password2) {
                alert('Пароли не совпадают');
                return;
            }

            // Load users
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.username === username || u.email === email)) {
                alert('Пользователь с таким логином или email уже существует');
                return;
            }

            const user = { username, email, full_name, password: password1 };
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            // Set current user and redirect to dashboard
            localStorage.setItem('currentUser', JSON.stringify(user));
            // create empty tickets storage for user
            localStorage.setItem(`tickets_${username}`, JSON.stringify([]));
            // redirect to dashboard in same folder
            window.location.href = 'dashboard.html';
        });
    }

    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = (loginForm.querySelector('[name="username"]') || {}).value?.trim();
            const password = (loginForm.querySelector('[name="password"]') || {}).value || '';
            if (!username || !password) { alert('Введите логин и пароль'); return; }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
            if (!user) { alert('Неверный логин или пароль'); return; }
            localStorage.setItem('currentUser', JSON.stringify(user));
            // redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }

});

// Utility for logout (can be called from dashboard.js or header)
function logout() {
    localStorage.removeItem('currentUser');
    // redirect to index in same folder
    window.location.href = 'index.html';
}
