const socket = io();

function sendMessage() {
    const username = document.getElementById('username').value.trim();
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if(username && message) {
        socket.emit('sendMessage', {
            username: username,
            message: message
        });
        
        messageInput.value = '';
    } else {
        alert('Заполните имя и сообщение!');
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Получение сообщений от сервера
socket.on('newMessage', (data) => {
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${data.username}</strong> (${data.timestamp}): ${data.message}`;
    messageElement.style.marginBottom = '10px';
    messageElement.style.padding = '5px';
    messageElement.style.borderBottom = '1px solid #eee';
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
});

// Обработка подключения/отключения
socket.on('connect', () => {
    console.log('Подключен к серверу');
});

socket.on('disconnect', () => {
    console.log('Отключен от сервера');
});
