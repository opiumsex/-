// Подключаем Socket.IO
const socket = io();

// Элементы DOM
const messagesContainer = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('messageInput');

// Функция отправки сообщения
function sendMessage() {
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!username) {
        alert('Пожалуйста, введите ваше имя!');
        usernameInput.focus();
        return;
    }
    
    if (!message) {
        alert('Пожалуйста, введите сообщение!');
        messageInput.focus();
        return;
    }

    // Отправляем сообщение на сервер
    socket.emit('sendMessage', {
        username: username,
        message: message
    });

    // Очищаем поле ввода
    messageInput.value = '';
    messageInput.focus();
}

// Функция для обработки нажатия Enter
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Функция добавления сообщения в чат
function addMessageToChat(messageData) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `
        <span class="username">${messageData.username}</span>
        <span class="time">${messageData.timestamp}</span>
        <div class="message-text">${messageData.message}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    
    // Прокручиваем к последнему сообщению
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Обработчики событий Socket.IO

// Подключение к серверу
socket.on('connect', () => {
    console.log('✅ Подключен к серверу');
    addSystemMessage('Подключено к серверу');
});

// Отключение от сервера
socket.on('disconnect', () => {
    console.log('❌ Отключен от сервера');
    addSystemMessage('Отключено от сервера');
});

// Получение истории сообщений
socket.on('messageHistory', (history) => {
    console.log('📚 Получена история сообщений:', history.length);
    messagesContainer.innerHTML = ''; // Очищаем контейнер
    
    if (history.length > 0) {
        history.forEach(message => {
            addMessageToChat(message);
        });
    }
});

// Получение нового сообщения
socket.on('newMessage', (messageData) => {
    console.log('📩 Новое сообщение:', messageData);
    addMessageToChat(messageData);
});

// Системные сообщения
function addSystemMessage(text) {
    const systemMessage = document.createElement('div');
    systemMessage.className = 'system-message';
    systemMessage.textContent = text;
    systemMessage.style.color = '#666';
    systemMessage.style.fontStyle = 'italic';
    systemMessage.style.textAlign = 'center';
    systemMessage.style.margin = '10px 0';
    
    messagesContainer.appendChild(systemMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Фокусируемся на поле ввода при загрузке
window.addEventListener('load', () => {
    messageInput.focus();
});
