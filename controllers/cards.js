const card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  card.create({ name, link, owner })
    .then((newCard) => res.send({ newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getAllCards = (req, res) => {
  card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.removeCardById = (req, res) => {
  const { cardId } = req.params;
  card.findByIdAndRemove(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        res.status(404).send({ message: 'Карточка с данным _id не обнаружена' });
        return;
      }
      res.send({ deletedCard, message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
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
        res.status(404).send({ message: 'Карточка с данным _id не обнаружена' });
        return;
      }
      res.status(200).send({ likedCard, message: 'Лайк поставлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
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
        res.status(404).send({ message: 'Карточка с данным _id не обнаружена' });
        return;
      }
      res.status(200).send({ dislikedCard, message: 'Лайк удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
