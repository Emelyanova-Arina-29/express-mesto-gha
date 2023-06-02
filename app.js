const express = require('express');
const mongoose = require('mongoose');
const http2Constants = require('http2').constants;
const router = require('./routes/routes');

const {
  HTTP_STATUS_NOT_FOUND,
} = http2Constants;

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '647788de6ce7afa74b20eb90',
  };

  next();
});

app.use('/', router);

app.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
