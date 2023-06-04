const cardRouter = require('express').Router();
const {
  createCard,
  getAllCards,
  removeCardById,
  likeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const {
  validationCreateCard,
  validationCardId,
} = require('../middlewares/validation');

cardRouter.post('/', validationCreateCard, createCard);

cardRouter.get('/', getAllCards);

cardRouter.delete('/:cardId', validationCardId, removeCardById);

cardRouter.put('/:cardId/likes', validationCardId, likeCard);

cardRouter.delete('/:cardId/likes', validationCardId, deleteLikeCard);

module.exports = cardRouter;
