// мидлвэр для авторизации
// middlewares/auth.js
const jwt = require('jsonwebtoken');
const Unauthorized401 = require('../errors/unauthorized401');
const { JWT_SECRET = 'secret-dev-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized401('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new Unauthorized401('Необходима авторизация под своей учетной записью'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
