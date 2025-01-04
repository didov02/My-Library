require('dotenv').config();
const methodOverride = require('method-override');
const express = require('express');
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authorsRoutes');
const userRouter = require('./routes/usersRoutes');
const bookRouter = require('./routes/booksRoutes');
const libraryBookRouter = require('./routes/libraryBooksRoutes');
const commentsRouter = require('./routes/commentsRoutes');
const ratingsRouter = require('./routes/ratingsRoutes');

const cookieParser = require('cookie-parser');

const app = express();

const port = process.env.PORT || 8081;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(methodOverride('_method'));

app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/users', userRouter);

app.use('/library', libraryBookRouter);
app.use('/comments', commentsRouter);
app.use('/ratings', ratingsRouter);
app.use('/books', bookRouter);


app.listen(port);
