import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

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

// Проверяем если уже инициализирован
let app;
try {
    app = initializeApp(firebaseConfig);
} catch (error) {
    app = getApp();
}

const database = getDatabase(app);

async function loadMenuTemplate() {
    try {
        // ИСПРАВЛЕН ПУТЬ - добавил /
        const response = await fetch('../templates/menu-item.html');
        return await response.text();
    } catch (error) {
        console.error('Ошибка загрузки шаблона:', error);
        return null;
    }
}

function renderMenuItem(template, item, itemKey) {
    return template
        .replace(/{{image}}/g, item.image || '')
        .replace(/{{name}}/g, item.name || '')
        .replace(/{{description}}/g, item.description || '')
        .replace(/{{composition}}/g, item.composition || '')
        .replace(/{{price}}/g, item.price || '')
        .replace(/{{id}}/g, itemKey || '');
}

async function loadMenu() {
    try {
        console.log('Начинаем загрузку меню...');
        
        const template = await loadMenuTemplate();
        if (!template) {
            throw new Error('Не удалось загрузить шаблон');
        }
        
        const menuRef = ref(database, 'menu');
        const snapshot = await get(menuRef);
        
        const menuGrid = document.getElementById('menu-grid');
        
        if (!snapshot.exists()) {
            menuGrid.innerHTML = '<p style="text-align: center; color: #8b4513; font-size: 18px; grid-column: 1 / -1;">Меню пока пустое</p>';
            return;
        }
        
        const menuData = snapshot.val();
        console.log('Загружено меню:', menuData);
        
        let menuHTML = '';
        
        Object.keys(menuData).forEach(itemKey => {
            const item = menuData[itemKey];
            menuHTML += renderMenuItem(template, item, itemKey);
        });
        
        menuGrid.innerHTML = menuHTML;
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                console.log('Добавлен товар:', itemId);
                alert('Товар добавлен в корзину!');
            });
        });
        
    } catch (error) {
        console.error('Ошибка загрузки меню:', error);
        document.getElementById('menu-grid').innerHTML = '<p style="text-align: center; color: red; grid-column: 1 / -1;">Ошибка загрузки меню</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadMenu);