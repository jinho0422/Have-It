const express = require('express');
const router = express.Router({mergeParams: true});
const controller = require('../controllers/habit');
const { isLoggedIn } = require('./auth_utils');
const { get_habit, get_noti, delete_exNoti } = require('./habit_utils');
const { rasp_delete, rasp_status, rasp_habit_update, rasp_habit_activate, rasp_habit_delete } = require('./rasp_utils');


router.get('/today', isLoggedIn, controller.today); // index: 오늘 달성률, 부재중 인포
router.get('/:habitId/today', isLoggedIn, get_habit, controller.habit_today); // index: 오늘 습관 알람 수행 정보

router.post('/', isLoggedIn, controller.create_habit); // C 설정: 습관 생성

router.post('/activate/:habitId/', isLoggedIn, get_habit, rasp_habit_activate, controller.activate_habit); // U 설정: 습관 수정(활성 비활성화)
router.post('/:habitId', isLoggedIn, get_habit, rasp_habit_update, controller.update_habit); // U 설정: 습관 이름 변경
router.delete('/:habitId', isLoggedIn, get_habit, rasp_habit_delete, controller.delete_habit); // D 설정: 습관 삭제

router.get('/noti', isLoggedIn, controller.habit_detail); // R 조회: 설정 첫째 화면
router.get('/:habitId/noti/', isLoggedIn, get_habit, controller.noti_detail); // R 설정에서 습관별 전체 알람 시간순 조회

router.post('/:habitId/noti/', isLoggedIn, get_habit, /*rasp_status,*/ controller.create_noti); // C 설정: 습관 별 알람 생성
router.post('/:habitId/noti/:notificationId', isLoggedIn, get_habit, get_noti, /*rasp_status,*/ delete_exNoti, rasp_delete, controller.update_noti); // U 설정: 알람 수정
router.delete('/:habitId/noti/:notificationId', isLoggedIn, get_habit, get_noti, /*rasp_status,*/ delete_exNoti, rasp_delete, controller.delete_noti); // D 설정: 알람 삭제

router.get('/monthly/:year/:month/', isLoggedIn, controller.habit_monthly_data_all);  // R 조회: 습관 전체 월별 데이터, 활성화 여부
router.get('/:habitId/weekly/', isLoggedIn, get_habit, controller.habit_weekly_data);  // R 조회: 개별 습관 주간 데이터
router.get('/:habitId/monthly/:year/:month/', isLoggedIn, get_habit, controller.habit_monthly_data);  // R 조회: 개별 습관 월별 데이터
router.get('/daily/:year/:month/:day/', isLoggedIn, controller.habit_daily_data_all); // R 조회: 전체 습관 일별 알람 데이터,
router.get('/:habitId/daily/:year/:month/:day/', isLoggedIn, get_habit, controller.habit_daily_data);  // R 조회: 개별 습관 일별 디테일

router.post('/daily/:dataId/', isLoggedIn, controller.update_received_data);
router.delete('/daily/:dataId/', isLoggedIn, controller.delete_received_data);

// router.get('/:habitId/noti/week/', isLoggedIn, get_habit, controller.noti_week_detail); // R 설정에서 습관별 알람 요일별 조회

module.exports = router;