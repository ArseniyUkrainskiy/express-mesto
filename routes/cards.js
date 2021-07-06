const router = require('express').Router();
const {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  deleteLikeOnCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', addCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', deleteLikeOnCard);
module.exports = router;
