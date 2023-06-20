const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

// Поиск всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);

};

// Поиск по ID
const getUserById = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id пользователя'));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Пользователь c id: ${userId} не найден`));
      } else {
        next(err);
      }
    });
};

const updProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.send({ name: user.name, about: user.about })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(
          'Переданы некорректные данные в методы обновления профиля',
        ));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Пользователь c id: ${req.user._id} не найден`));
      } else {
        next(err);
      }
    });
};

const updAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(
          'Переданы некорректные данные в методы обновления аватара пользователя',
        ));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Пользователь c id: ${req.user._id} не найден`));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => {
      User.create({ name, about, avatar, email, password: hash })
    })
    .then(user => {
      console.log(user)
      res.send(user)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(
          'Переданы некорректные данные при создании пользователя',
        ));
      } else if (err.code === 11000) {
        next(new ConflictError(
          'Пользователь с таким электронным адресом уже существует',
        ));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
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
  createUser,
  updProfile,
  updAvatar,
  login,
};