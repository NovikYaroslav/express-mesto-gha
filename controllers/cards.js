const card = require('../models/card');

const PermissionError = require('../utils/errors/PermissionError');
const NotFoundError = require('../utils/errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  card
    .create({ name, link, owner: req.user._id })
    .then((newCard) => res.send({ data: newCard }))
    .catch(next);
};

// module.exports.deleteCard = (req, res, next) => {
//   card
//     .findByIdAndRemove(req.params.cardId)
//     .orFail(() => next(new NotFoundError('Карточка с таким id не найдена')))
//     .then((targetCard) => {
//       if (req.user._id === targetCard.owner.toString()) {
//         res.send({ message: 'Карточка удалена' });
//       } else {
//         next(
//           new PermissionError(
//             'Невозможно удалить карточку другого пользователя',
//           ),
//         );
//       }
//     })
//     .catch(next);
// };

module.exports.deleteCard = (req, res, next) => {
  card
    .findById(req.params.cardId)
    .orFail(() => next(new NotFoundError('Карточка с таким id не найдена')))
    .then((cardToDelete) => {
      if (req.user._id === cardToDelete.owner.toString()) {
        card.findByIdAndRemove(req.params.cardId).then(() => {
          res.send({ message: 'Карточка удалена' });
        });
      } else {
        next(
          new PermissionError(
            'Невозможно удалить карточку другого пользователя',
          ),
        );
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => next(new NotFoundError('Карточка с таким id не найдена')))
    .then((targetCard) => res.send({ data: targetCard }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => next(new NotFoundError('Карточка с таким id не найдена')))
    .then((targetCard) => res.send({ data: targetCard }))
    .catch(next);
};
