const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/NotFoundError');
const { URL_REGEX } = require('../utils/const');
const { login, createUser } = require('../controllers/users');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(2),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(URL_REGEX).messages({
        'string.pattern.base': 'Введите корректный url аватара',
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'Введите корректный email',
      }),
      password: Joi.string().required().min(2),
    }),
  }),
  createUser,
);
router.use(auth);
router.use('/users', userRouter);

router.use('/cards', cardRouter);

router.use('*', () => {
  throw new NotFoundError('Запрашиваемая страница не найдена');
});

module.exports = router;
