require('dotenv').config();
const methodOverride = require('method-override');
const express = require('express');
const indexRouter = require('./routes/index')
const userRouter = require('./routes/usersRoutes');
const bookRouter = require('./routes/booksRoutes');
const libraryBookRouter = require('./routes/libraryBooksRoutes');
const ratingRouter = require('./routes/ratingsRoutes');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
});

const cookieParser = require('cookie-parser');

const port = process.env.PORT || 8081;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(methodOverride('_method'));

app.use('/uploads', express.static('uploads'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', userRouter);

app.use('/library', libraryBookRouter);
app.use('/ratings', ratingRouter);
app.use('/books', bookRouter);

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('message', (message) => {
        console.log('Received message from client:', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.set('io', io);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});