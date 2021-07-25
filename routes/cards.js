const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const validator = require('validator');
const validationMethod = (data) => {
  const expLink = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm;
  if (validator.isURL(data) && expLink.test(data)) {
    return data;
  }
  throw new Error('URL для карточки введен неправильно');
};

const {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  deleteLikeOnCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validationMethod),
  }).unknown(true),
}), addCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(), // это hex последовательность
  }).unknown(true),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(), // это hex последовательность
  }).unknown(true),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(), // это hex последовательность
  }).unknown(true),
}), deleteLikeOnCard);

module.exports = router;
