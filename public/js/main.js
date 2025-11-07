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
    window.location.href = 'pages/login.html';
}

async function handleLogout(e) {
    e.preventDefault();
    await logout();
    window.location.reload();
}

// Проверяем при загрузке
document.addEventListener('DOMContentLoaded', updateAuthUI);

// И при изменении авторизации
auth.onAuthStateChanged(updateAuthUI);


