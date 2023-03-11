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
const errorHandler = require('./middlewares/error-handler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

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
  login
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        avatar: Joi.string()
          .pattern(
            /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
          )
          .messages({
            'string.pattern.base': 'Введите корректный url аватара',
          }),
        email: Joi.string().email().required().messages({
          'string.email': 'Введите корректный email',
        }),
        password: Joi.string().required().min(2),
      })
      .unknown(true),
  }),
  createUser
);
app.use(auth);
app.use('/users', require('./routers/users'));
app.use('/cards', require('./routers/cards'));
// app.use(errors());
app.use(errorHandler);
