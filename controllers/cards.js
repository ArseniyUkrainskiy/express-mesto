const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка.' }));
};

module.exports.addCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => (err.name === 'ValidationError'
      ? res.status(400).send({
        message: 'Переданы некорректные данные при создании карточки.',
      })
      : res.status(500).send({
        message: 'На сервере произошла ошибка.',
      })));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      }
      return res.status(200).send({ card });
    })
    .catch((err) => (err.name === 'CastError'
      ? res.status(400).send({
        message: 'Был передан невалидный идентификатор _id.',
      })
      : res.status(500).send({
        message: 'На сервере произошла ошибка.',
      })));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      }
      return res.status(200).send({ card });
    })
    .catch((err) => (err.name === 'CastError'
      ? res.status(400).send({
        message: 'Переданы некорректные данные _id для постановки лайка.',
      })
      : res.status(500).send({
        message: 'На сервере произошла ошибка.',
      })));
};
module.exports.deleteLikeOnCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      }
      return res.status(200).send({ card });
    })
    .catch((err) => (err.name === 'CastError'
      ? res.status(400).send({
        message: 'Переданы некорректные данные _id для снятия лайка.',
      })
      : res.status(500).send({
        message: 'На сервере произошла ошибка.',
      })));
};
