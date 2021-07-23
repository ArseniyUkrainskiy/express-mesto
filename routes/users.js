const router = require('express').Router();
const {
  getUsers,
  // getUser,
  getCurrentUser,
  createUser,
  login,
  updateProfile,
  updateUserAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
// роуты, не требующие авторизации
router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);
// роуты, которым авторизация нужна (и далее в cards)
router.get('/users', getUsers);
// router.get('/users/:userId', getUser);
router.get('/users/me', getCurrentUser); // роут для получения информации о пользователе

router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
