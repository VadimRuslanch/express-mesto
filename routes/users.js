const router = require('express').Router();

const {
  getUsers, getUserById, updProfile, updAvatar, getCurrentUser,
} = require('../controllers/users');

const {
  validationUpdateUser, validationUpdateAvatar, validationUserId,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userID', validationUserId, getUserById);
router.patch('/me', validationUpdateUser, updProfile);
router.patch('/me/avatar', validationUpdateAvatar, updAvatar);

module.exports = router;
