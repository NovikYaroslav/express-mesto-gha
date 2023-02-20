const card = require('../models/card');

// module.exports.createCard = (req, res) => {
//   console.log(req.user._id);
// };




// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору


module.exports.getCards = (req, res) => {
  card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  console.log(req.body)

  card.create({ name, link })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => res.status(500).send({ message: err}));
};

module.exports.deleteCard = (req, res) => {
  console.log(req.params.cardId);
  console.log("удаляю карточку")
  card.findByIdAndRemove(req.params.cardId)
  .then((card) => res.send({ data: card }))
  .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};
