const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, { expiresIn: '7d' });

      // вернём токен
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
      /* res.send({ token }); */
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({
      message: 'На сервере произошла ошибка.',
    }));
};

module.exports.addUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(200).send(user))
      .catch((err) => (err.name === 'ValidationError'
        ? res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        })
        : res.status(500).send({
          message: 'На сервере произошла ошибка.',
        }))));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      }
      return res.status(200).send(user);
    })
    .catch((err) => (err.name === 'CastError'
      ? res.status(400).send({
        message: 'Был передан невалидный идентификатор _id.',
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
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `Переданы некорректные данные при обновлении профиля.${err.message}`,
        });
      } else if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Был передан невалидный идентификатор _id.',
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
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      } else if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Был передан невалидный идентификатор _id.',
        });
      } else {
        res.status(500).send({
          message: 'На сервере произошла ошибка.',
        });
      }
    });
};
