const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const user = require('../models/user');
const { JWT_SECRET } = require('../config');

const ERROR_CODE_404 = 404;
const ERROR_CODE_401 = 401;
const ERROR_CODE_409 = 409;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  user
    .findOne({ email })
    .select('+password')
    .orFail(() =>
      res.status(ERROR_CODE_401).send({ message: 'Пользователь не найден' })
    )
    .then((userData) =>
      bcrypt.compare(password, userData.password).then((matched) => {
        if (matched) {
          const jwt = jsonwebtoken.sign({ _id: userData._id }, JWT_SECRET, {
            expiresIn: '7d',
          });
          res.send({ jwt });
          return;
        }
        next({ code: ERROR_CODE_401 });
      })
    )
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      user.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((newUser) =>
      res.send({
        email: newUser.email,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
      })
    )
    .catch((err) => {
      if (!password || !email) {
        next({ code: ERROR_CODE_401 });
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  user
    .findById(req.params.userId)
    .then((targetUser) => {
      if (targetUser === null) {
        next({ code: ERROR_CODE_404 });
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
      { new: true, runValidators: true }
    )
    .then((updatedUser) => res.send({ data: updatedUser }))
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  user
    .findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true }
    )
    .then((updatedAvatar) => res.send({ data: updatedAvatar }))
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'ValidationError') {
  //     res.status(ERROR_CODE_400).send({
  //       message: 'Переданы некорректные данные в методы обновления аватара пользователя',
  //     });
  //   } else {
  //     res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' });
  //   }
  // });
};
