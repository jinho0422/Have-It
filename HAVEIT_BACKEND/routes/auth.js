const express = require('express');
const router = express.Router({mergeParams: true});

const controller = require('../controllers/auth');
const { isLoggedIn, isNotLoggedIn } = require('./auth_utils');


router.post('/signup', isNotLoggedIn, controller.signup);

router.post('/login', isNotLoggedIn, controller.login);

router.get('/logout', isLoggedIn, controller.logout);

router.get('/check', isLoggedIn, controller.check);


module.exports = router;