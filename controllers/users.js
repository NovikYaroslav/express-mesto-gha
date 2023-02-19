const user = require('../models/user');

module.exports.getUsers = (req, res) => {
  user.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user.create({ name, about, avatar })
    .then((newUser) => res.send({ data: newUser }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// module.exports.getUsers = (req, res) => {
//   user.find({})
//     .then((users) => res.send({ data: users }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// };
