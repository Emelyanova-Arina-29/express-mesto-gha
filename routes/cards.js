const cardRouter = require('express').Router();
const {
  createCard, getAllCards, removeCardById, likeCard, deleteLikeCard,
} = require('../controllers/cards');

cardRouter.post('/', createCard);

cardRouter.get('/', getAllCards);

cardRouter.delete('/:cardId', removeCardById);

cardRouter.put('/:cardId/likes', likeCard);

cardRouter.delete('/:cardId/likes', deleteLikeCard);

module.exports = cardRouter;
