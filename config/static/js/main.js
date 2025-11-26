/* main.js — базовая логика навигации, burger-menu, scroll-to-top, и переключение пунктов меню по авторизации */

document.addEventListener('DOMContentLoaded', () => {
    // Burger menu
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    if (burger) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // Scroll to top button
    const scrollBtn = document.querySelector('.scroll-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Update nav links depending on auth state
    function updateNav() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        document.querySelectorAll('.nav-auth').forEach(el => el.style.display = 'none');
        if (currentUser) {
            document.querySelectorAll('.auth-logged').forEach(el => el.style.display = 'inline-flex');
            document.querySelectorAll('.auth-guest').forEach(el => el.style.display = 'none');
        } else {
            document.querySelectorAll('.auth-logged').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.auth-guest').forEach(el => el.style.display = 'inline-flex');
        }
    }
    updateNav();

    // Logout from header
    const logoutHeader = document.getElementById('logoutBtnHeader');
    if (logoutHeader) {
        logoutHeader.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            updateNav();
            window.location.href = 'index.html';
        });
    }


    // Language selection
    const langSelect = document.getElementById('langSelect');
    const setLang = (l) => {
        localStorage.setItem('lang', l);
        if (window.I18N) window.I18N.apply(l);
    };
    const savedLang = localStorage.getItem('lang') || 'ru';
    if (window.I18N) window.I18N.apply(savedLang);
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', () => setLang(langSelect.value));
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', () => {
            if (navLinks.classList.contains('show')) navLinks.classList.remove('show');
        });
    });

    // Toggle password fields (buttons with data-target attribute)
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.querySelector(btn.dataset.target);
            if (!target) return;
            if (target.type === 'password') {
                target.type = 'text';
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16"><path d="M13.359 11.238C14.13 10.24 14.794 9.19 15.322 8.123c-.7-1.22-1.67-2.36-2.79-3.24C11.161 3.07 9.234 2 8 2 6.766 2 4.839 3.07 3.468 4.884 2.347 5.764 1.378 6.904.678 8.124c.528 1.067 1.192 2.117 1.963 3.115.745.955 1.67 1.787 2.77 2.4L2.146 14.854a.5.5 0 1 0 .708.708l12-12a.5.5 0 0 0-.708-.708L13 2.293 9.207 6.086a3 3 0 0 1 4.152 4.152l.0.0z"/></svg>';
            } else {
                target.type = 'password';
                btn.innerHTML = '<i class="bi bi-eye"></i>';
            }
        });
    });
});
