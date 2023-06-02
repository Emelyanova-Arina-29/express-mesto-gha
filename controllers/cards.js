const http2Constants = require('http2').constants;
const card = require('../models/card');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2Constants;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  card.create({ name, link, owner })
    .then((newCard) => res.status(HTTP_STATUS_CREATED).send({ newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getAllCards = (req, res) => {
  card.find({})
    .populate('owner')
    .then((cards) => res.status(HTTP_STATUS_OK).send({ cards }))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.removeCardById = (req, res) => {
  const { cardId } = req.params;
  card.findByIdAndRemove(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с данным _id не обнаружена' });
        return;
      }
      res.status(HTTP_STATUS_OK).send({ deletedCard, message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((likedCard) => {
      if (!likedCard) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с данным _id не обнаружена' });
        return;
      }
      res.status(HTTP_STATUS_OK).send({ likedCard, message: 'Лайк поставлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteLikeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((dislikedCard) => {
      if (!dislikedCard) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с данным _id не обнаружена' });
        return;
      }
      res.status(HTTP_STATUS_OK).send({ dislikedCard, message: 'Лайк удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
