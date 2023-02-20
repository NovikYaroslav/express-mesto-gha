const user = require('../models/user');

module.exports.getUsers = (req, res) => {
  user.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body)
  console.log("создаю пользователя")
  user.create({ name, about, avatar })
    .then((newUser) => res.send({ data: newUser }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  if (!user[req.params.id]) {
    res.send(`Такого пользователя не существует`);
    return;
  }
  const { name, about, avatar } = users[req.params.id];
  res.send(`Пользователь ${name}, Дейтельность ${about}`);
};
