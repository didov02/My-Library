require('dotenv').config();
const express = require('express');
const authorRouter = require('./routes/authorsRoutes');
const app = express();

const port = process.env.PORT || 8081;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/authors', authorRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
