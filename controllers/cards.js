const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в методы создания карточки'));
      } else next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardID } = req.params;

  return Card
    .findById(cardID)
    .orFail(() => {
      throw new NotFoundError(`Пользователь c id: ${req.user._id} не найден`);
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }
      return card.remove().then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError(`Карточка с id: ${cardId} не найдена`);
    })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`Передан некорректный id: ${cardId} в методы лайка карточки`));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
