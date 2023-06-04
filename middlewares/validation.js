const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  BadRequestError,
} = require('../errors/errors');

const validationSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationSigIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validationUpdateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((url) => {
      const isValid = validator.isURL(url);
      if (isValid) {
        return url;
      }
      throw new BadRequestError('Неправильный формат ссылки');
    }),
  }),
});

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((url) => {
      const isValid = validator.isURL(url);
      if (isValid) {
        return url;
      }
      throw new BadRequestError('Неправильный формат ссылки');
    }),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validationSignUp,
  validationSigIn,
  validationUserId,
  validationUpdateUser,
  validationUpdateUserAvatar,
  validationCreateCard,
  validationCardId,
};
