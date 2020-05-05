const express = require('express');
const router = express.Router({mergeParams: true});

const controller = require('../controllers/rasp');
const { isLoggedIn, } = require('./auth_utils');
const { rasp_status } = require('./rasp_utils');

router.post('/', controller.create_received_data);

router.post('/update/:dollId/', isLoggedIn, controller.update_dollName);
router.delete('/:dollId/', isLoggedIn, rasp_status, controller.delete_all);

router.get('/sync/:dollId/', isLoggedIn, rasp_status, controller.rasp_sync);

router.get('/activate/:dollId/', isLoggedIn, rasp_status, controller.toggle_activate);

router.post('/cushion/:serialNumber/', controller.cushion_create);

router.post('/web_register', isLoggedIn, controller.register_device_from_web);
router.post('/rasp_register', controller.register_device_from_rasp);

module.exports = router;
