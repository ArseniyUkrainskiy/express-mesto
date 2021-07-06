const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // имя — это строка
      required: [
        true,
        'должно быть у каждого пользователя, так что имя — обязательное поле',
      ],
      minlength: [2, 'минимальная длина имени — 2 символа'],
      maxlength: [30, 'максимальная длина 30 символов'],
    },
    about: {
      type: String,
      required: [
        true,
        'должно быть у каждого пользователя, так что о себе — обязательное поле',
      ],
      minlength: [2, 'минимальная длина имени — 2 символа'],
      maxlength: [30, 'максимальная длина 30 символов'],
    },
    avatar: {
      type: String,
      required: [
        true,
        'должно быть у каждого пользователя, так что аватар — обязательное поле',
      ],
    },
  },
  { versionKey: false },
);
module.exports = mongoose.model('user', userSchema);
