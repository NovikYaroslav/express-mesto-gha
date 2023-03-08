
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findOne({ email, password })
    .orFail(() => res.status(404).send({ message: 'Пользователь не найден Login' }))
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      return res.status(404).send({ message: 'Пользователь не найден Login Hash' });
    }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ jwt, _id });
    })
    .catch((err) => res.status(404).send({ message: err.message }))
};