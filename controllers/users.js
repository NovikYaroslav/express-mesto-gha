const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const user = require('../models/user');
const { JWT_SECRET } = require('../utils/const');
const BadRequestError = require('../utils/errors/BadRequestError');
const AuthorizationError = require('../utils/errors/AuthorizationError');
const NotFoundError = require('../utils/errors/NotFoundError');
const DublicationError = require('../utils/errors/DublicationError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  user
    .findOne({ email })
    .select('+password')
    .orFail(() => next(new AuthorizationError('Пользователь не найден')))
    .then((userData) => bcrypt.compare(password, userData.password).then((matched) => {
      if (matched) {
        const jwt = jsonwebtoken.sign({ _id: userData._id }, JWT_SECRET, {
          expiresIn: '7d',
        });
        res.send({ jwt });
        return;
      }
      next(new AuthorizationError('Пользователь не найден'));
    }))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => user.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => res.send({
      email: newUser.email,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные в методы создания пользователя',
          ),
        );
      }
      if (err.code === 11000) {
        next(new DublicationError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  user
    .findById(req.params.userId)
    .then((targetUser) => {
      if (!targetUser) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        res.send({ data: targetUser });
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  user
    .findById(req.user._id)
    .then((CurrentUser) => res.send({ data: CurrentUser }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  user
    .findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, about: req.body.about },
      { new: true, runValidators: true },
    )
    .then((updatedUser) => res.send({ data: updatedUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные в методы обновления пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  user
    .findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    )
    .then((updatedAvatar) => res.send({ data: updatedAvatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные в методы создания пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
};
