const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const {
  createUser, login,
} = require('../controllers/users');

const {
  NotFoundError,
} = require('../errors/errors');

const {
  validationSignUp,
  validationSigIn,
} = require('../middlewares/validation');

router.post('/signup', validationSignUp, createUser);
router.post('/signin', validationSigIn, login);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use('*', auth, () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
