const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.listen(PORT, () => {
  console.log(`Приложение запущено на ${PORT} порту`);
});
