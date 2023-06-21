const router = require('express').Router();

const { getUsers, getUserById, updProfile, updAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userID', getUserById);
router.patch('/me', updProfile);
router.patch('/me/avatar', updAvatar);

module.exports = router;