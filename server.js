const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Статическая директория для фронтенда
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Хранение сообщений (в памяти)
let messages = [];

// Обработка подключений
io.on('connection', (socket) => {
    console.log('Новый пользователь подключен:', socket.id);

    // Отправка истории сообщений новому пользователю
    socket.emit('messageHistory', messages);

    // Получение сообщения от клиента
    socket.on('sendMessage', (data) => {
        const messageData = {
            id: Date.now(),
            username: data.username,
            message: data.message,
            timestamp: new Date().toLocaleTimeString()
        };

        // Сохраняем сообщение
        messages.push(messageData);
        
        // Ограничиваем историю последними 100 сообщениями
        if (messages.length > 100) {
            messages = messages.slice(-100);
        }

        // Отправка сообщения всем подключенным клиентам
        io.emit('newMessage', messageData);
        console.log('Сообщение отправлено:', messageData);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключен:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
