const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  validationCreateCard,
  validationCardById,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validationCreateCard, createCard);
router.delete('/:cardID', validationCardById, deleteCard);
router.put('/:cardID/likes', validationCardById, likeCard);
router.delete('/:cardID/likes', validationCardById, dislikeCard);

module.exports = router;
