require('dotenv').config();
const express = require('express');
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authorsRoutes');
const userRouter = require('./routes/usersRoutes');
const app = express();

const port = process.env.PORT || 8081;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
