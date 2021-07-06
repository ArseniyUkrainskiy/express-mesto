const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        'должно быть у каждой карточки, так что название — обязательное поле',
      ],
      minlength: [2, 'минимальная длина названия — 2 символа'],
      maxlength: [30, 'максимальная длина 30 символов'],
    },
    link: {
      type: String,
      required: [
        true,
        'должно быть у каждой карточки, так что ссылка — обязательное поле',
      ],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Обязательное поле создателя карточки не заполнено'],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, default: [null] }],
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);
module.exports = mongoose.model('card', cardSchema);
