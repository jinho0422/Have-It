const express = require('express');
const router = express.Router({mergeParams: true});
const controller = require('../controllers/admin');
const { isLoggedIn, isAdmin } = require('./auth_utils');


router.get('/restore/habit/:habitId/', isLoggedIn, isAdmin,  controller.restore_habit); // 관리자권한 습관 복구
router.get('/restore/noti/:notificationId/', isLoggedIn, isAdmin, controller.restore_noti); // 관리자권한 습관 복구
router.get('/restore/user/:userId/', isLoggedIn, isAdmin, controller.restore_user); // 관리자권한 유저 복구

module.exports = router;