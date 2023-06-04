const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const router = require('./routes/routes');
const errorsHandler = require('./errors/errorsHandler');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use('/', router);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
