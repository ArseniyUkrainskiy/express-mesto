const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Для создания токенов
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({
      message: 'На сервере произошла ошибка.',
    }));
};

module.exports.updateProfile = (req, res) => {
  const { name = 'Жак-Ив Кусто', about = 'Исследователь' } = req.body;
  User.findByIdAndUpdate(
    req.user.id,
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
  const { avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png' } = req.body;
  User.findByIdAndUpdate(
    req.user.id,
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
// контроллер аутентификации
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль отсутствует.' });
  }
  // Проверим, есть ли пользователь в базе
  return User.findOne({ email }).select('+password')
    .orFail(() => res.status(404).send({
      message: 'Пользователь с таким Email не найден',
    }))
    .then((user) => {
      if (!user) {
        return res.status(401).send({
          message: 'Пользователь с таким Email уже существует',
        });
      }
      // пользователь найден
      // проверка пароля
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send({
              message: 'Email или пароль некорректный.',
            });
          }
          // метод jwt.sign, чтобы создать токен
          const token = jwt.sign({
            id: user._id,
          }, 'SECRET-KEY', { expiresIn: '7d' });
          return res.send({ token });
        })
        .catch(() => res.status(500).send({
          message: 'На сервере произошла ошибка.',
        }));
    })
    .catch(() => res.status(500).send({
      message: 'На сервере произошла ошибка.',
    }));
};

// Регистрация нового пользователя
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body; // Данные всех полей - в теле запроса.
  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль отсутствует.' });
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Пользователь с таким Email уже есть в системе.' });
      }
      // Хеширование пароля
      return bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name, about, avatar, email, password: hash, // +записываем хеш в базу
          })
            .then(({ _id }) => res.status(200).send({ _id, email }))
            .catch((err) => {
              if (err.message) {
                return res.send(err.message);
              }
              return res.status(500).send({
                message: 'На сервере произошла ошибка.',
              });
            });
        });
    })
    .catch(() => res.status(500).send({
      message: 'На сервере произошла ошибка.',
    }));
};

// контроллер для получения информации о пользователе
module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.send(user);
  } catch (e) {
    res.send({ message: 'Пользователь не найден' });
  }
};
