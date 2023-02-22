const user = require('../models/user');

module.exports.getUsers = (req, res) => {
  const ERROR_CODE = 500;
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  user
    .create({ name, about, avatar })
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({
          message:
            'Переданы некорректные данные в методы создания пользователя',
        });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getUser = (req, res) => {
  user
    .findById(req.params.userId)
    .then((targetUser) => {
      if (targetUser === null) {
        const ERROR_CODE = 404;
        res
          .status(ERROR_CODE)
          .send({ message: 'Пользователь нет в базе данных' });
      } else { res.send({ data: targetUser }); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Некорректный id пользователя' });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
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
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные в методы обновления профиля',
        });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
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
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({
          message:
            'Переданы некорректные данные в методы обновления аватара пользователя',
        });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};
