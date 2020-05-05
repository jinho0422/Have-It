const express = require('express');
const router = express.Router({mergeParams: true});

const controller = require('../controllers/device');
const { isLoggedIn } = require('./auth_utils');
const { rasp_status } = require('./rasp_utils');

// 배포 시에는 인형 상태 확인, 데이터를 넘겨주어야 하지만 기기에 접근할 수 없어서 임의 데이터로 제공 합니다.
router.get('/cushion/', isLoggedIn, controller.get_cushion_doll);
router.get('/cushion/:dollId/today/', isLoggedIn, /*rasp_status,*/ controller.get_cushion_data_now);
router.get('/cushion/:dollId/:year/:month', isLoggedIn, /*rasp_status,*/ controller.get_cushion_data_month);

module.exports = router;
