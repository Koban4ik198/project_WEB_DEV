// Импортируем Firebase функции
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { 
    getDatabase, 
    ref, 
    set 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";



// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDhULjv6XubWcH0xMpajKaOgxGM2MiBqK0",
    authDomain: "piesdatabase.firebaseapp.com",
    projectId: "piesdatabase",
    storageBucket: "piesdatabase.firebasestorage.app",
    messagingSenderId: "907034785220",
    appId: "1:907034785220:web:f98cf07572fafcaa06a091",
    measurementId: "G-4ZBRKKTJLB"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
console.log('База инициализирована:', database);

// Получаем элементы DOM
const registerToggle = document.getElementById('register-toggle');
const loginToggle = document.getElementById('login-toggle');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const loginFormElement = document.getElementById('loginForm');
const registerFormElement = document.getElementById('registerForm');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');

console.log('Элементы DOM:');
console.log('registerToggle:', registerToggle);
console.log('loginToggle:', loginToggle);
console.log('registerForm:', registerForm);
console.log('loginForm:', loginForm);
console.log('loginFormElement:', loginFormElement);
console.log('registerFormElement:', registerFormElement);
console.log('loginMessage:', loginMessage);
console.log('registerMessage:', registerMessage);

// Проверяем, что все необходимые элементы существуют
if (!registerToggle || !loginToggle || !registerForm || !loginForm || 
    !loginFormElement || !registerFormElement || !loginMessage || !registerMessage) {
    console.error('Не все элементы DOM найдены! Проверьте ID в HTML');
}

// Переключение между формами
registerToggle.addEventListener('click', () => {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    registerToggle.style.background = '#bfa67a';
    loginToggle.style.background = 'rgba(0,0,0,0.1)';
    clearMessages();
});

loginToggle.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    loginToggle.style.background = '#bfa67a';
    registerToggle.style.background = 'rgba(0,0,0,0.1)';
    clearMessages();
});

// Очистка сообщений
function clearMessages() {
    loginMessage.textContent = '';
    registerMessage.textContent = '';
}

// Обработка входа
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        loginMessage.style.color = 'green';
        loginMessage.textContent = 'Успешный вход!';
        
        // Перенаправляем на главную страницу через 1 секунду
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка входа:', error);
        loginMessage.style.color = 'red';
        
        switch (error.code) {
            case 'auth/invalid-email':
                loginMessage.textContent = 'Неверный формат email';
                break;
            case 'auth/user-not-found':
                loginMessage.textContent = 'Пользователь не найден';
                break;
            case 'auth/wrong-password':
                loginMessage.textContent = 'Неверный пароль';
                break;
            case 'auth/too-many-requests':
                loginMessage.textContent = 'Слишком много попыток. Попробуйте позже';
                break;
            default:
                loginMessage.textContent = 'Ошибка входа: ' + error.message;
        }
    }
});

// Обработка регистрации
registerFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Проверка совпадения паролей
    if (password !== confirmPassword) {
        registerMessage.textContent = 'Пароли не совпадают';
        return;
    }
    
    // Проверка длины пароля
    if (password.length < 6) {
        registerMessage.textContent = 'Пароль должен содержать минимум 6 символов';
        return;
    }
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await set(ref(database, 'users/' + user.uid), {
            name: name,
            email: email,
            registrationDate: new Date().toISOString(),
            favoritePies: []
        });

        registerMessage.style.color = 'green';
        registerMessage.textContent = 'Регистрация успешна!';
        
        console.log('Пользователь создан:', user);
        
        // Автоматически переключаем на форму входа после успешной регистрации
        setTimeout(() => {
            loginToggle.click();
            document.getElementById('login-email').value = email;
        }, 2000);
        
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        registerMessage.style.color = 'red';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                registerMessage.textContent = 'Email уже используется';
                break;
            case 'auth/invalid-email':
                registerMessage.textContent = 'Неверный формат email';
                break;
            case 'auth/weak-password':
                registerMessage.textContent = 'Пароль слишком слабый';
                break;
            default:
                registerMessage.textContent = 'Ошибка регистрации: ' + error.message;
        }
    }
    
    localStorage.setItem('userName', name);
});

// Проверяем авторизацию при загрузке страницы
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('Пользователь авторизован:', user.email);
        // Если пользователь уже авторизован, перенаправляем на главную
        // window.location.href = '/index.html';
    } else {
        console.log('Пользователь не авторизован');
    }
});

console.log('loginpage.js загружен успешно');