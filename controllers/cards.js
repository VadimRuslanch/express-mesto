const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  req.user = {
    _id: '6485cd144f2bbad724aa4820'
  };

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(
          'Переданы некорректные данные в методы создания карточки',
        ));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.body;
  console.log(req.body)
  req.user = {
    _id: '6485cd144f2bbad724aa4820'
  };

  Card.findById(cardId)
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(cardId).then(() => res.send(card));
      } else {
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(
          `Передан некорректны id: ${cardId} в методы удаления карточки`,
        ));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Карточка с id: ${cardId} не найдена`));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(
          `Передан некорректный id: ${cardId} в методы постановки лайка карточки`,
        ));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Карточка с id: ${cardId} не найдена`));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId,
    { $pull: { likes: req.user._id } },
    { new: true },)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(
          `Передан некорректный id: ${cardId} в методы удаления лайка с карточки`,
        ));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Карточка с id: ${cardId} не найдена`));
      } else {
        next(err);
      }
    });
}
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};