const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'минимальная длина имени — 2 символа'],
      maxlength: [30, 'максимальная длина 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'минимальная длина имени — 2 символа'],
      maxlength: [30, 'максимальная длина 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: [
        true,
        'должно быть у каждого пользователя, так что email — обязательное поле',
      ],
      unique: [
        true,
        'должно быть уникальным у каждого пользователя, так что email — обязательное уникальное поле',
      ],
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: 'введите электронную почту правильно',
      },
    },
    password: {
      type: String,
      required: [
        true,
        'должно быть у каждого пользователя, так что password — обязательное поле',
      ],
    },
  },
  { versionKey: false },
);
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
    // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
