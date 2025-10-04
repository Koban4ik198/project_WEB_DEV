import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDhULjv6XubWcH0xMpajKaOgxGM2MiBqK0",
    authDomain: "piesdatabase.firebaseapp.com",
    projectId: "piesdatabase",
    databaseURL: "https://piesdatabase-default-rtdb.firebaseio.com/",
    storageBucket: "piesdatabase.firebasestorage.app",
    messagingSenderId: "907034785220",
    appId: "1:907034785220:web:f98cf07572fafcaa06a091",
    measurementId: "G-4ZBRKKTJLB"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Функция для проверки авторизации
export function checkAuthState() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        });
    });
}

// Функция для выхода
export function logout() {
    return signOut(auth);
}

// Функция для получения текущего пользователя
export function getCurrentUser() {
    return auth.currentUser;
}

// Экспортируем auth для использования в других модулях
export { auth };