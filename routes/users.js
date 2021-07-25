const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const validator = require('validator');
const validationMethod = (data) => {
  const expLink = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm;
  if (validator.isURL(data) && expLink.test(data)) {
    return data;
  }
  throw new Error('URL для аватара введен неправильно');
};

const {
  getUsers,
  // getUser,
  getCurrentUser,
  createUser,
  login,
  updateProfile,
  updateUserAvatar,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

// роуты, не требующие авторизации
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);

router.use(auth);

// роуты, которым авторизация нужна (и далее в cards)
router.get('/users', getUsers);
// router.get('/users/:userId', getUser);
router.get('/users/me', getCurrentUser); // роут для получения информации о пользователе

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2).max(30).custom(validationMethod),
  }),
}), updateUserAvatar);

module.exports = router;
