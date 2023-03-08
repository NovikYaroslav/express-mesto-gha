const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const user = require('../models/user');
const { JWT_SECRET } = require('../config');

const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500 } = require('../utils/errors');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  user
    .findOne({ email })
    .select('+password')
    .orFail(() => res.status(404).send({ message: 'Пользователь не найден Login' }))
    .then((userData) => bcrypt.compare(password, userData.password).then((matched) => {
      if (matched) {
        return user;
      }
      return res.status(404).send({ message: 'Пользователь не найден Login Hash' });
    }))
    .then((loggedUser) => {
      const jwt = jsonwebtoken.sign({ _id: loggedUser._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ jwt });
    })
    .catch((err) => res.status(404).send({ message: err.message }));
};

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
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
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => {
      if (!password || !email) {
        res.status(404).send({ message: 'Заполните все обязательные поля' });
      }
      if (err.code === 11000) {
        res
          .status(ERROR_CODE_404)
          .send({ message: 'Пользователь с такими данными уже существует' });
      }
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные в методы создания пользователя',
        });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getUser = (req, res) => {
  user
    .findById(req.params.userId)
    .then((targetUser) => res.send({ data: targetUser }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getCurrentUser = (req, res) => {
  const { payload } = req.body;

  user
    .findById(payload._id)
    .then((CurrentUser) => res.send({ data: CurrentUser }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  user
    .findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, about: req.body.about },
      { new: true, runValidators: true },
    )
    .then((updatedUser) => res.send({ data: updatedUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные в методы обновления профиля',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  user
    .findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    )
    .then((updatedAvatar) => res.send({ data: updatedAvatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные в методы обновления аватара пользователя',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
