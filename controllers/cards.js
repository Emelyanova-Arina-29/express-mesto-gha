const http2Constants = require('http2').constants;
const card = require('../models/card');

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../errors/errors');

const {
  HTTP_STATUS_CREATED,
} = http2Constants;

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  card.create({ name, link, owner })
    .then((newCard) => res.status(HTTP_STATUS_CREATED).send({ newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.getAllCards = (req, res, next) => {
  card.find({})
    .populate('owner')
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.removeCardById = (req, res, next) => {
  const { cardId } = req.params;
  card.findById(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        return next(new NotFoundError('Карточка с данным _id не обнаружена'));
      }
      if (req.user._id !== deletedCard.owner._id.toString()) {
        return next(new ForbiddenError('У вас нет прав для удаления этой карточки'));
      }
      return card.findByIdAndRemove(cardId)
        .then(() => res.send({ deletedCard, message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((likedCard) => {
      if (!likedCard) {
        return next(new NotFoundError('Карточка с данным _id не обнаружена'));
      }
      return res.send({ likedCard, message: 'Лайк поставлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при попытке лайкнуть карточку'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteLikeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((dislikedCard) => {
      if (!dislikedCard) {
        return next(new NotFoundError('Карточка с данным _id не обнаружена'));
      }
      return res.send({ dislikedCard, message: 'Лайк удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при попытке убрать лайк с карточки'));
      } else {
        next(err);
      }
    });
};
