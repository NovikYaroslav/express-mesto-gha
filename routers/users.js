const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/me', getCurrentUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser
);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
