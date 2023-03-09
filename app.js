const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { PORT } = require('./config');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler').default;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
const { ERROR_CODE_404 } = require('./middlewares/error-handler');

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT);
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(2),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(2),
      })
      .unknown(true),
  }),
  createUser,
);
app.use(auth);
app.use('/users', require('./routers/users'));
app.use('/cards', require('./routers/cards'));

app.use((res) => {
  res.status(ERROR_CODE_404).send({ message: 'Страница не найдена' });
});
app.use(errors());
app.use(errorHandler);
