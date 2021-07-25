const mongoose = require('mongoose');
const validator = require('validator'); // Для валидации воспользуйтесь модулем validator, npm i validator.

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'минимальная длина имени — 2 символа'],
      maxlength: [30, 'максимальная длина 30 символов'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'минимальная длина имени — 2 символа'],
      maxlength: [30, 'максимальная длина 30 символов'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(avatar) {
          return validator.isURL(avatar);
        },
      },
    },
    email: {
      type: String,
      required: true,
      unique: true, // email должен быть уникальным.
      validate: { // опишем свойство validate.
        validator(email) { // validator - функция проверки данных.
          return validator.isEmail(email);
        },
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);
module.exports = mongoose.model('user', userSchema);
