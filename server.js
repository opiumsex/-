const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Настройка CORS для Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Маршруты
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Хранение сообщений
let messages = [];

// Socket.IO соединения
io.on('connection', (socket) => {
    console.log('✅ Новый пользователь подключен:', socket.id);

    // Отправляем историю сообщений новому пользователю
    socket.emit('messageHistory', messages);

    // Обработка отправки сообщения
    socket.on('sendMessage', (data) => {
        console.log('📨 Получено сообщение:', data);
        
        const messageData = {
            id: Date.now(),
            username: data.username || 'Аноним',
            message: data.message,
            timestamp: new Date().toLocaleTimeString('ru-RU')
        };

        // Добавляем сообщение в историю
        messages.push(messageData);
        
        // Ограничиваем историю
        if (messages.length > 100) {
            messages = messages.slice(-100);
        }

        // Отправляем всем клиентам
        io.emit('newMessage', messageData);
        console.log('📤 Сообщение отправлено всем:', messageData);
    });

    socket.on('disconnect', () => {
        console.log('❌ Пользователь отключен:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📱 Откройте http://localhost:${PORT} в браузере`);
});
