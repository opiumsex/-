const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Статическая директория для фронтенда
app.use(express.static(path.join(__dirname, 'public')));

// Обработка подключений
io.on('connection', (socket) => {
    console.log('Новый пользователь подключен');

    // Получение сообщения от клиента
    socket.on('sendMessage', (data) => {
        // Отправка сообщения всем подключенным клиентам
        io.emit('newMessage', {
            username: data.username,
            message: data.message,
            timestamp: new Date().toLocaleTimeString()
        });
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключен');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});