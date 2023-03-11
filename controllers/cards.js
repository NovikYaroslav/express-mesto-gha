const card = require('../models/card');

const {
  BadRequestError,
  AuthorizationError,
  PermissionError,
  NotFoundError,
  DublicationError,
} = require('../utils/errors');

module.exports.getCards = (req, res, next) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  card
    .create({ name, link })
    .then((newCard) => res.send({ data: newCard }))
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'ValidationError') {
  //     res.status(400).send({
  //       message: 'Переданы некорректные данные в методы создания карточки',
  //     });
  //   } else {
  //     res.status(500).send({ message: 'Произошла ошибка' });
  //   }
  // });
};

module.exports.deleteCard = (req, res, next) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((targetCard) => {
      if (!targetCard) {
        next(new NotFoundError('Карточка с таким id не найдена'));
      } else {
        res.send({ data: targetCard });
      }
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     res.status(404).send({ message: 'Карточка не найдена' });
  //   } else {
  //     res.status(500).send({ message: 'Произошла ошибка' });
  //   }
  // });
};

module.exports.likeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((targetCard) => {
      if (!targetCard) {
        next(new NotFoundError('Карточка с таким id не найдена'));
      } else {
        res.send({ data: targetCard });
      }
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     res.status(404).send({ message: 'Карточка не найдена' });
  //   } else {
  //     res.status(500).send({ message: 'Произошла ошибка' });
  //   }
  // });
};

module.exports.dislikeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => next(new NotFoundError('Карточка с таким id не найдена')))
    .then((targetCard) => res.send({ data: targetCard }))
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     res.status(404).send({ message: 'Карточка не найдена' });
  //   } else {
  //     res.status(500).send({ message: 'Произошла ошибка' });
  //   }
  // });
};
