const Card = require('../models/card');
const BadRequest400 = require('../errors/badRequest400');
const Forbidden403 = require('../errors/forbidden403');
const NotFound404 = require('../errors/notFound404');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.addCard = (req, res, next) => {
  const { name, link, owner = req.user.id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => (err.name === 'ValidationError'
      ? next(new BadRequest400('Переданы некорректные данные при создании карточки.'))
      : next(err)));
};

/* module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound404('Карточка с указанным _id не найдена.');
      }
      // eslint-disable-next-line eqeqeq
      if (card.owner != req.user.id) {
        // Authorized but Forbidden
        throw new Forbidden403('Нельзя удалить чужую карточку.');
      }
      return res.send({ card });
    })
    .catch((err) => (err.name === 'CastError'
      ? next(new BadRequest400('Был передан невалидный идентификатор _id.'))
      : next(err)));
}; */

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound404('Карточка с указанным _id не найдена.');
      } else if (card.owner.toString() === req.user.id) {
        // карточка найдена
        // проверим кто создал, строгое сравнение и по типу данных
        Card.findByIdAndDelete(req.params.cardId)
          .then(() => res.send({ card }))
          .catch(next);
      } else throw new Forbidden403('Нельзя удалить чужую карточку.');
    })
    .catch((err) => (err.name === 'CastError'
      ? next(new BadRequest400('Был передан невалидный идентификатор _id.'))
      : next(err)));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound404('Карточка с указанным _id не найдена.');
      }
      return res.send({ card });
    })
    .catch((err) => (err.name === 'CastError'
      ? next(new BadRequest400('Переданы некорректные данные _id для постановки лайка.'))
      : next(err)));
};
module.exports.deleteLikeOnCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound404('Карточка с указанным _id не найдена.');
      }
      return res.send({ card });
    })
    .catch((err) => (err.name === 'CastError'
      ? next(new BadRequest400('Переданы некорректные данные _id для снятия лайка.'))
      : next(err)));
};
