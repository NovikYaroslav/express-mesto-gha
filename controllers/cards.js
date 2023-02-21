const card = require('../models/card');

module.exports.getCards = (req, res) => {
  const ERROR_CODE = 500;
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  card
    .create({ name, link })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные в методы создания карточки',
        });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((targetCard) => {
      if (targetCard === null) {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({ message: 'Карточки нет в базе данных' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Некорректный id карточки' });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((targetCard) => {
      if (targetCard === null) {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({ message: 'Карточки нет в базе данных' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Некорректный id карточки' });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((targetCard) => {
      if (targetCard === null) {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({ message: 'Карточки нет в базе данных' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({ message: 'Некорректный id карточки' });
      } else {
        const ERROR_CODE = 500;
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};
