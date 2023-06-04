const bcrypt = require('bcryptjs');
const http2Constants = require('http2').constants;
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require('../errors/errors');

const {
  HTTP_STATUS_CREATED,
} = http2Constants;

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => user.create(
      {
        name, about, avatar, email, password: hash,
      },
    ))
    .then((User) => res.status(HTTP_STATUS_CREATED).send({
      name: User.name,
      about: User.about,
      avatar: User.avatar,
      email: User.email,
      _id: User._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже создан'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((User) => {
      const token = jwt.sign({ _id: User._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getAllUsers = (req, res, next) => {
  user.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  user.findById(req.user._id)
    .then((User) => {
      if (!User) {
        return next(new NotFoundError('Пользователь с данным _id не обнаружен'));
      }
      return res.send({ User });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  user.findById(userId)
    .then((foundUser) => {
      if (!foundUser) {
        return next(new NotFoundError('Пользователь с данным _id не обнаружен'));
      }
      return res.send({ foundUser });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при поиске пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  user.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new NotFoundError('Пользователь с данным _id не обнаружен'));
      }
      return res.send({ updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении данных профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  user.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new NotFoundError('Пользователь с данным _id не обнаружен'));
      }
      return res.send({ updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении данных профиля'));
      } else {
        next(err);
      }
    });
};
