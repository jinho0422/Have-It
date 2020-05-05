const express = require('express');
const router = express.Router({mergeParams: true});

const controller = require('../controllers/user');
const { isLoggedIn } = require('./auth_utils');

router.get('/:userName/', isLoggedIn, controller.user_detail);
router.post('/:userName/', isLoggedIn, controller.update_user);
router.delete('/:userName/', isLoggedIn, controller.delete_user);

module.exports = router;