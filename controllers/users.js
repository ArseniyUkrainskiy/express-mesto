const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({
      message: 'На сервере произошла ошибка.',
    }));
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => (err.name === 'ValidationError'
      ? res.status(400).send({
        message: 'Переданы некорректные данные при создании пользователя.',
      })
      : res.status(500).send({
        message: 'На сервере произошла ошибка.',
      })));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => (err.name === 'CastError'
      ? res.status(404).send({
        message: 'Пользователь по указанному _id не найден.',
      })
      : res.status(500).send({
        message: 'На сервере произошла ошибка.',
      })));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } else if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Пользователь с указанным _id не найден.',
        });
      } else {
        res.status(500).send({
          message: 'На сервере произошла ошибка.',
        });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      } else if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Пользователь с указанным _id не найден.',
        });
      } else {
        res.status(500).send({
          message: 'На сервере произошла ошибка.',
        });
      }
    });
};
