const cardRouter = require('express').Router();
const {
  createCard, getAllCards, removeCardById, likeCard, deleteLikeCard,
} = require('../controllers/cards');

cardRouter.post('/cards', createCard);

cardRouter.get('/cards', getAllCards);

cardRouter.delete('/cards/:cardId', removeCardById);

cardRouter.put('/cards/:cardId/likes', likeCard);

cardRouter.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = cardRouter;
