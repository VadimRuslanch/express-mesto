const router = require('express').Router();

const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardID', deleteCard);
router.put('/:cardID/likes', likeCard)
router.delete('/:cardID/likes', dislikeCard)

module.exports = router;