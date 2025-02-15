require('dotenv').config();
const methodOverride = require('method-override');
const express = require('express');
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authorsRoutes');
const userRouter = require('./routes/usersRoutes');
const bookRouter = require('./routes/booksRoutes');
const libraryBookRouter = require('./routes/libraryBooksRoutes');
const ratingRouter = require('./routes/ratingsRoutes');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

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
app.use('/authors', authorRouter);
app.use('/users', userRouter);

app.use('/library', libraryBookRouter);
app.use('/ratings', ratingRouter);
app.use('/books', bookRouter);

wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');
    ws.on('message', (message) => {
        console.log('Received:', message);
    });
});

app.locals.broadcast = (data) => {
    console.log('Broadcasting data to WebSocket clients:', data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});