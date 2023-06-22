const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

// Поиск всех пользователей
const getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(next);
};

// Поиск по ID
const getUserById = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(`Пользователь c id: ${userId} не найден`);
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные в метод обновления профиля'));
        return;
      }
      next(err);
    });
};

const updProfile = (req, res, next) => {
  const { name, about } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new NotFoundError(`Пользователь c id: ${req.user._id} не найден`);
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в метод обновления профиля'));
      } else next(err);
    });
};

const updAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new NotFoundError(`Пользователь c id: ${req.user._id} не найден`);
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в методы обновления аватара пользователя'));
      } else next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(`Пользователь c id: ${req.user._id} не найден`);
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(BadRequestError('Переданы некорректные данные'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь не найден'));
      } else next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then(() => res.status(201).send({
      data: {
        name, about, avatar, email,
      },
    }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким электронным адресом уже существует'));
      } if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } next(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-key',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: (7 * 24 * 60 * 60),
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Вы успешно авторизовались!' })
        .end();
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  updProfile,
  updAvatar,
  getCurrentUser,
  login,
  createUser,
};
