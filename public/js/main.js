import { checkAuthState, logout, auth } from './auth-manager.js';

async function updateAuthUI() {
    const user = await checkAuthState();
    const authBtn = document.getElementById('auth-btn');
    const userGreeting = document.getElementById('user-greeting');
    const accountLink = document.getElementById('account-link');

    // Проверяем что кнопка существует
    if (!authBtn) {
        console.log('Кнопка auth-btn не найдена');
        return;
    }

    if (user) {
        // Пользователь авторизован
        authBtn.textContent = 'Выйти';
        authBtn.onclick = handleLogout;

        // Безопасно работаем с элементами
        if (userGreeting) {
            userGreeting.textContent = '';
            userGreeting.style.display = 'none';
        }
        if (accountLink) {
            accountLink.style.display = 'inline';
        }

    } else {
        // Пользователь не авторизован
        authBtn.textContent = 'Вход';
        authBtn.onclick = handleLogin;

        // Безопасно работаем с элементами
        if (userGreeting) {
            userGreeting.style.display = 'none';
        }
        if (accountLink) {
            accountLink.style.display = 'none';
        }
    }
}

function handleLogin(e) {
    e.preventDefault();
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    window.location.href = isIndex ? 'pages/login.html' : 'login.html';
}

async function handleLogout(e) {
    e.preventDefault();
    await logout();
    window.location.reload();
}

// Hamburger menu toggle
function toggleHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Close hamburger menu when clicking outside or on a link
function closeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('#nav-menu a');

    // Close when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Close when clicking outside
    document.addEventListener('click', function(event) {
        if (hamburger && navMenu && !hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Проверяем при загрузке
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    toggleHamburgerMenu();
    closeHamburgerMenu();
});

// И при изменении авторизации
auth.onAuthStateChanged(updateAuthUI);


