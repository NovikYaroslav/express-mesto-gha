const express = require('express');
const mongoose = require('mongoose');
// const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { PORT } = require('./config');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT);
app.use(express.json());
app.use(helmet());
// app.use(rateLimit());
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(2),
    }),
  }),
  login
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(30),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(2),
      })
      .unknown(true),
  }),
  createUser
);
app.use('/users', auth, require('./routers/users'));
app.use('/cards', auth, require('./routers/cards'));
app.use(errors());
app.use(errorHandler);

// app.use((req, res) => {
//   res.status(404).send({ message: 'Страница не найдена' });
// });
