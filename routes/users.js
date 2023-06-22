const router = require('express').Router();

const {
  getUsers, getUserById, updProfile, updAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userID', getUserById);
router.patch('/me', updProfile);
router.patch('/me/avatar', updAvatar);

module.exports = router;
