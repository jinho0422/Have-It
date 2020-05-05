// {where : sequelize.and({progressStatus: 'progressStatus002'} ,sequelize.or({CompareStartTimes: {[sequelize.Op.gte]:param.popupStartDate+' '+param.popupStartTime}} ,{CompareEndTimes:{[sequelize.Op.lte]:param.popupEndDate+' '+param.popupEndTime}} ) )}
// 출처: https://avengersrhydon1121.tistory.com/236 [익명의 개발노트]

// function uniqBy(a, key) {
//   let seen = new Set();
//   return a.filter(item => {
//     let k = key(item);
//     return seen.has(k) ? false : seen.add(k)
//   });
// }
//
// const a = uniqBy(notification, it => it.dollId);
//
//
//
// function getUniqueObjectArray(array, key) {
//   return array.filter((item, i) => {
//     return array.findIndex((item2, j) => {
//       return item.key === item2.key;
//     }) === i;
//   });
// }


// const request = require('request');
// const { Received_data, Habit, Notification, Doll, User, sequelize } = require('../models');
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
//
// const today_weekId = 2 **  moment().format("d");
//
//
// const userId = 11;
// const habit = Habit.findAll({
//   where: { userId, weekId: today_weekId }
// });
//
//
//
//
// const notification = async () => {
//   const habit = Habit.findAll({
//     attributes: ['id'],
//     where: { userId: 11 },
//     // raw: true,
//   });
//   const habitIds = habit.map(h => h.id);
//
//   await Notification.findAll({
//     attributes: ['id', 'time', 'weekId'],
//     where: {
//       habitId: {
//         [Op.or]: [habitIds]
//       }
//     },
//     include: {
//       model: Habit,
//       attributes: ['habitName'],
//       raw: true,
//     },
//   }).then(res => console.log(JSON.stringify(res)));
// };

// console.log(notification());
// notification();
// data = {};
// data.notification = notification;
// console.log(data);




// https://sequelize.org/v5/manual/querying.html#operators
// https://sequelize.org/master/class/lib/data-types.js~DATE.html


// const moment = require('moment');
// let data = 14;
// for(let i = 0; i <= 6; i++){
//   if(data & (1 << i)){
//     console.log(i);
//   }
// }

// //
// // const dolls = () => {
// //   Doll.findAll({
// //     attributes: [ 'id', 'dollName'],
// //     where: { userId: 1 },
// //     include: [{
// //       model: Doll_icon,
// //       as: 'doll_icon',
// //       attributes: ['icon']
// //     }],
// //     // raw: true,
// //   }).then(res => console.log(JSON.stringify(res)));
// // };
// // dolls()
// // console.log(dolls);
// const { User, Habit, Habit_icon, Notification, Received_data, Doll, Doll_icon } = require('../models');
//
// function test(x) {
//   Notification.findAll({
//     attributes: ['id', 'time', 'weekId'],
//     where: { habitId: x.id },
//     raw: true,
//   }).then(res => JSON.stringify(res))
// }
//
// const notification = [];
//
// const habits = async () => {
//   await Habit.findAll({
//     attributes: ['id', 'habitName'],
//     where: { userId: 1 },
//     raw: true,
//   }).then(habit => {
//     console.log(habit);
//     habit.forEach(h => {
//       Notification.findAll({
//         attributes: ['id', 'time', 'weekId'],
//         where: { habitId: h.id },
//         raw: true,
//         include: [{
//           model: Habit,
//           attributes: ['habitName']
//         }]
//       }).then(res => {
//         console.log(res);
//         notification.push(res);
//       });
//     })
//   });
// };
//
// async function send_data() {
//   const result = await habits();
//
// }
//
// send_data();
// // console.log('send_data')
// // console.log(notification);
//
// const moment = require('moment');
// const day_info = {
//   'Sun': 0,
//   'Mon': 1,
//   'Tue': 2,
//   'Wed': 3,
//   'Thu': 4,
//   'Fri': 5,
//   'Sat': 6,
// };
//
// const today_index = day_info[moment().format("ddd")] + 1;
//
//
// /*
// * 오늘 알람 정보
// * 1. user 의 오늘(요일) 습관을 찾는다.
// *   -> 월요일 -> 습관 1
// *                습관 2
// */
// //
// // let habit = [];
// // const habits = async () => {
// //   await Habit.findAll({
// //     attributes: [ 'id', 'habitName', 'habitIconId' ],
// //     where: { userId: 1, weekId: today_index },
// //     raw: true,
// //   }).then(res => { habit = JSON.stringify(res)
// //   });
// //
// //   // habit = habits();
// //   console.log(habit)
// // };
//
// // habits();
//
// /*[
//   { id: 1, habitName: 'water', habitIconId: 1 },
//   { id: 2, habitName: 'coding', habitIconId: 2 }
// ]
// * */
//
// /* 2. 습관 별 오늘(요일) 기준 알람의 총 횟수를 찾는다.
// *
// *
// * 3. habit.id -> forEach
// *   received data 에서 오늘 날짜 + is_done=1 을 cnt
// *   received data 에서 오늘 날짜 + is_done=0 을 cnt
// *
// *
// * 4. mapping
// *
// * {
// *   {
// *     habitId: 1
// *     habitName: '물먹기'
// *     habitIcon: {
// *                   id: 1
// *                   url: blah
// *                 }
// *     today_total: 5
// *     now_is_done: 2
// *     now_not_done: 1
// *
// * */
//
// let habit_week_Id = 0; // 화, 목, 토
// let targetDay = 16 + 32 + 64; // 내가 주는 요일 데이터
//
// // 수, 목, 금 추가
// for (let i=0; i<=6; i++) {
//   if (targetDay & (1 << i)) {
//     console.log(i);
//     habit_week_Id |= (1 << i);
//     console.log(habit_week_Id);
//   }
// }
// -> habit_week_Id에 요일 추가

// 수, 목, 금 삭제
// for (let i=0; i<=6; i++) {
//   if (targetDay & (1 << i)) {
//     habit_week_Id &= ~(1 << i);
//   }
// }
// habit_week_Id에서 해당 요일 뺌

// const test = {0: {} };
// console.log(test[0]);
// test[0].bye = 'tt';
// console.log(test[0]['bye']);
//
// const a = {};
// for (let i=0; i < a.length; i++) {
//   console.log(i);
// }




/*

-------------------===============moment================--------------------------------

*/


// SELECT `id` FROM `habits` AS `habit` WHERE (`habit`.`deletedAt` IS NULL AND (`habit`.`createdAt` < '2020-02-07 11:32:40' AND `h
// abit`.`createdAt` > '2020-02-07 00:00:00'))

// https://stackoverflow.com/questions/42031906/adding-minutes-to-datetime-in-momentjs/42032202
//
// const { Notification, Noti_detail, Habit } = require('../models');
// const moment = require('moment');
// const day_info = {
//   0: 'Sun',
//   1: 'Mon',
//   2: 'Tue',
//   3: 'Wed',
//   4: 'Thu',
//   5: 'Fri',
//   6: 'Sat',
// };
// const {Op} = require('sequelize');
//
//
// // https://yonoo88.tistory.com/266
//
// const today_weekId = 2 **  moment().format("d");
// // 32

// const today = moment().format('YYYY-MM-DD');
// console.log(new Date());
// // console.log(new Date() - 24 * 60 * 60 * 1000);
// console.log(today);
// Habit.findAll({
//   attributes: ['id'],
//   where: {
//     createdAt: {
//       [Op.lt]: new Date(),
//       [Op.gt]: today,
//     }
//   },
//   // where: {createdAt: {between: [new Date(), Date.parse(today)]}},
//   raw: true,
// }).then(res => console.log(res));


//
// const a = '12:00';
// const b = Number(a.slice(0, 2));
// // console.log(b);
// const c = '15:00';
// // let si = Number(a.slice(0, 2));
// // let end = Number(c.slice(0, 2));
// // for (let si = Number(a.slice(0, 2)); si <= end; si++) {
// //   console.log(si);
// // }
//
// // let start_si = moment(a, 'HH:mm').format('HH:mm');
// const cc = moment(a, 'HH:mm').add(60, 'm').format('HH:mm');
// // let added = start_si.add(15, 'min');
// // console.log(start_si);
// // console.log(cc);
//
// const test_start = '09:00';
// const test_end = '12:00';



// let a = false;
// a ? console.log('true') : console.log('false');
// const moment = require('moment');
// const today = moment().format('YYYY-MM-DD');
// console.log(today);



// const repeatAmount = Number('15');
// let startTime = moment('09:00', 'HH:mm').format('HH:mm');
// const endTime = moment('12:00', 'HH:mm').format('HH:mm');
// while (startTime <= endTime) {
//   console.log(startTime);
//   startTime = moment(startTime, 'HH:mm').add(repeatAmount, 'm').format('HH:mm');
// }



// const end_time = moment('13:00', 'HH:mm').format('HH:mm');
// const repeat = Number("15");
// for (let start_time = moment('12:00', 'HH:mm').format('HH:mm');
//      start_time <= end_time;
//      start_time = moment(start_time, 'HH:mm').add(repeat, 'm').format('HH:mm')
// ) {
//   console.log(start_time);
// }

// console.log(cnt);


// // var d = new Date();
// const d = new Date('2020-02-10');
// // console.log("이전 주차 월요일: " + getWeek(d.getDay(), 'prev') + ', 다음 주차 월요일' + getWeek(d.getDay(), 'next'));
// console.log("이번 주 일요일: " + getWeek(d.getDay(), 'prev') + ', 이번 주 토요일' + getWeek(d.getDay(), 'next'));
//
// function getWeek(day, flag) {
//   // var d = new Date();
//   // const d = new Date('2020-02-10');
//   const d = new Date('2020-02-10');
//
//   console.log(day);
//   var dist;
//   // console.log(d);
//   if(flag == 'next') {
//     dist = day == 0 ? 5 : 6 - day;
//   } else if(flag == 'prev') {
//     dist = day == 0 ? -1 : -(day);
//   }
//   console.log(dist);
//   d.setDate(d.getDate() + dist);
//   return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
// }
//
//
// const getWeek = (day, flag) => {
//   const d = new Date();
//   let dist;
//   if(flag === 'next') {
//     dist = day === 0 ? 6 : 5 - day;
//   } else if(flag === 'prev') {
//     dist = day === 0 ? 0 : -(day);
//   }
//   d.setDate(d.getDate() + dist);
//   return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
// };

// const d = new Date();
// const sunday = getWeek(d.getDay(), 'prev');
// const saturday =  getWeek(d.getDay(), 'next');
//
// const end_day = moment(saturday, 'YYYY-MM-DD').format('MM.DD');
// // const repeat = Number("15");
// for (let start_day = moment(sunday, 'YYYY-MM-DD').format('MM.DD');
//      start_day <= end_day;
//      start_day = moment(start_day, 'MM.DD').add(1, 'd').format('MM.DD')
// ) {
//   console.log(start_day);
// }

// console.log(cnt);


// const getMonthh = () => {
//   const d = new Date();
//   // const d = new Date('2020-01-31')
//   // let dist;
//   // if(flag === 'next') {
//   //   dist = day === 0 ? 5 : 6 - day;
//   // } else if(flag === 'prev') {
//   //   dist = day === 0 ? -1 : -(day);
//   // }
//   // d.setDate(d.getDate() + dist);
//   // return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
//   return d.getMonth()
// };

// console.log(getMonthh()+1);

// const test_weekId = moment().format("d");

// let start_day = moment(sunday, 'YYYY-MM-DD').format('MM.DD');
// const weekId = moment('2020-02-12').format('e');

// console.log(test_weekId, weekId);

// console.log(moment().format('e'));
//
// const d = new Date();
//
// const sunday = getWeek(d.getDay(), 'prev');
// const saturday =  getWeek(d.getDay(), 'next');

//
// const end_day = moment(saturday, 'YYYY-MM-DD').format('MM.DD');
// for (let start_day = moment(sunday, 'YYYY-MM-DD').format('MM.DD');
//      start_day <= end_day;
//      start_day = moment(start_day, 'MM.DD').add(1, 'day').format('MM.DD')
// ) {
//   console.log(start_day);
//   const weekId = moment(start_day).format('e');
//   console.log(weekId);
// }
//
// const dddd = moment('2020-02-19').day(0).format('YYYY-MM-DD');
// const ccccc = moment('2020-02-19').day(6).format('YYYY-MM-DD');
// console.log(dddd, ccccc);
// console.log('hi')