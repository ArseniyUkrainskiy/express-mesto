const router = require('express').Router();
const {
  getUsers,
  getUser,
  addUser,
  updateProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', addUser);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateUserAvatar);
module.exports = router;
