const {Habit, Doll, Notification, Habit_icon, Noti_detail, Received_data } = require('../models');
const moment = require('moment');
const {Op} = require('sequelize');
const { rasp_create } = require('../routes/rasp_utils');
const {
  find_receivedData_weekly, find_receivedData_monthly, find_all_receivedData_daily,
  find_receivedData_daily, find_receivedData_today, find_alarm,
  make_habit_weekId, create_noti_detail } = require('../routes/habit_func');
const { getWeek, uniqBy, repeatCnt } = require('../routes/functions');

module.exports = {
  /**
   *
   * @swagger
   *  /habit/today/:
   *    get:
   *      tags:
   *      - Today
   *      description: today (main) page data, 오늘 습관 달성률 + 부재중 알람
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *
   *      responses:
   *       200:
   *        description: index page 기본 데이터
   *
   *
   * @swagger
   *  /habit/{habitId}/today/:
   *    get:
   *      tags:
   *      - Today
   *      description: today (main) page data, 습관 정보
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: index page 습관별 오늘 알람 수행 데이터
   *
   *
   * @swagger
   *  /habit/{habitId}/weekly/:
   *    get:
   *      tags:
   *      - Today
   *      description: 이번 주 습관 알람 조회, 이번 주 가장 많이 달성한 횟수, 습관 D-day 등 제공
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 해당 주차의 습관 데이터 제공
   *
   */
  /**
   *
   *
   * @swagger
   *  /habit/monthly/{year}/{month}/:
   *    get:
   *      tags:
   *      - 습관 분석
   *      description: monthly
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: year
   *        in: path
   *        type: int
   *      - name: month
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 전체 습관 조회 및 달력 생성
   *
   *
   * @swagger
   *  /habit/{habitId}/monthly/{year}/{month}/:
   *    get:
   *      tags:
   *      - 습관 분석
   *      description: monthly
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitId
   *        in: path
   *        type: int
   *      - name: year
   *        in: path
   *        type: int
   *      - name: month
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 월별 개별 습관 데이터 조회
   *
   *
   * @swagger
   *  /habit/{habitId}/daily/{year}/{month}/{day}/:
   *    get:
   *      tags:
   *      - 습관 분석
   *      description: monthly
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitId
   *        in: path
   *        type: int
   *      - name: year
   *        in: path
   *        type: int
   *      - name: month
   *        in: path
   *        type: int
   *      - name: day
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 일별 개별 습관 데이터 조회
   *
   *
   * @swagger
   *  /habit/daily/{year}/{month}/{day}/:
   *    get:
   *      tags:
   *      - 습관 분석
   *      description: monthly
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: year
   *        in: path
   *        type: int
   *      - name: month
   *        in: path
   *        type: int
   *      - name: day
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 일별 전체 습관 알람 데이터 조회
   *
   *
   * @swagger
   *  /habit/daily/{dataId}:
   *    post:
   *      tags:
   *      - 습관 분석
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: dataId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 사용자가 수행 이력 변경하고자 하는 경우 (is_done)
   *
   *
   * @swagger
   *  /habit/daily/{dataId}:
   *    delete:
   *      tags:
   *      - 습관 분석
   *      description: monthly
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: dataId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 수행 이력을 삭제 해버리고 싶은 경우 (복구 안 됨)
   *
   */
  /**
   *
   * @swagger
   *  /habit/{habitId}/:
   *    post:
   *      tags:
   *      - 습관 설정
   *      description: 습관명 변경하기
   *      produces:
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitId
   *        in: path
   *        type: int
   *      - name: habitName
   *        in: formData
   *        type: string
   *
   *      responses:
   *       200:
   *        description: 습관명이 변경되었다는 메시지
   *
   * @swagger
   *  /habit/activate/{habitId}/:
   *    post:
   *      tags:
   *      - 습관 설정
   *      description: 습관 활성/비활성화
   *      produces:
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 습관 활성화 / 비활성화 결과 여부
   *
   * @swagger
   *  /habit/{habitId}/:
   *    delete:
   *      tags:
   *      - 습관 설정
   *      description: 습관 삭제
   *      produces:
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 습관 삭제 메시지
   *
   * @swagger
   *  /habit/:
   *    post:
   *      tags:
   *      - 습관 설정
   *      description: 습관생성
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitName
   *        in: formData
   *        type: string
   *      - name: habitIconId
   *        in: formData
   *        type: string
   *
   *      responses:
   *       200:
   *        description: 습관 생성
   *
   */
  /**
   *
   * @swagger
   *  /habit/{habitId}/noti/:
   *    post:
   *      tags:
   *      - 알람 설정
   *      description: 습관알람생성, body에 아래와 같이 담아주세요.
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitId
   *        in: path
   *        type: int
   *      - in: body
   *        name: noti_data
   *        schema:
   *          type: object
   *          required:
   *            - time
   *            - weekId
   *            - repeat
   *            - dollId
   *          example: {"time":"09:00", "weekId":10, "repeat": 15, "endTime": "14:30", "dollId": 10}
   *
   *      responses:
   *       200:
   *        description: 습관 알람 생성 성공 메시지
   *
   *
   * @swagger
   *  /habit/noti/:
   *    get:
   *      tags:
   *      - 알람 설정
   *      description: 알람 설정 페이지, 초기 화면
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *
   *      responses:
   *       200:
   *        description: 전체 습관 목록 조회
   *
   * @swagger
   *  /habit/{habitId}/noti/:
   *    get:
   *      tags:
   *      - 알람 설정
   *      description: 습관 알람 설정 페이지, 습관 전체 알람 조회
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 알람 시간 순 정렬한 전체 목록
   *
   *
   * @swagger
   *  /habit/{habitId}/noti/{notificationId}/:
   *    post:
   *      tags:
   *      - 알람 설정
   *      description: 알람 설정 변경
   *      produces:
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitId
   *        in: path
   *        type: int
   *      - name: notificationId
   *        in: path
   *        type: int
   *      - in: body
   *        name: noti_data
   *        schema:
   *          type: object
   *          required:
   *            - time
   *            - weekId
   *            - repeat
   *            - dollId
   *          example: {"time":"09:00", "weekId":4, "repeat": 30, "dollId": 10, "endTime": "14:00"}
   *
   *      responses:
   *       200:
   *        description: 알람 설정 변경 성공 메시지
   *
   *
   * @swagger
   *  /habit/{habitId}/noti/{notificationId}/:
   *    delete:
   *      tags:
   *      - 알람 설정
   *      description: 알람 삭제
   *      produces:
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: habitId
   *        in: path
   *        type: int
   *      - name: notificationId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 알람 삭제 완료
   *
   */

  // index page
  today: async (req, res, next) => {
    try {
      const today_weekId = 2 **  moment().format('e');

      const userId = req.user.id;
      const notiDetailSet = await Noti_detail.findAll({
        attributes: [ 'id', 'notificationId' ],
        where: {
          weekId: today_weekId,
        },
        include: [{
          model: Habit,
          as: 'habit',
          attributes: ['id', 'habitName'],
          where: {
            userId: userId,
            is_activated: true,
          },
          include: [{
            model: Habit_icon,
            as: 'habit_icon',
            attributes: ['icon'],
          }]
        }],
      });

      let habitSet = await uniqBy(await notiDetailSet.map(h => h.habit), it => it.id);
      const habitIdSet = await uniqBy(await notiDetailSet.map(h => h.habit.id), it => it);
      const notiIdSet = await notiDetailSet.map(data => data.notificationId);

      let achievementData = {};
      const missedNoti = [];
      if (habitIdSet.length) {
        for (let i=0; i < habitIdSet.length; i++) {
          achievementData[habitIdSet[i]] = {nowTotal: 0, nowDone: 0, nowFalse: 0};
        }

        const receivedData = await find_receivedData_today(notiIdSet);
        for (let j=0; j < receivedData.length; j++) {
          achievementData[receivedData[j]["noti_detail.habitId"]].nowTotal += 1;
          if (receivedData[j].is_done) {
            achievementData[receivedData[j]["noti_detail.habitId"]].nowDone += 1;
          } else {
            achievementData[receivedData[j]["noti_detail.habitId"]].nowFalse += 1;
            missedNoti.push(receivedData[j]);
          }
        }
      }
      let message = 'hi';
      let messageSecond = 'hihi';
      if (!notiDetailSet.length) {
        message = null;
        const temp = await Doll.findAll({
          where: {userId: req.user.id}
        });
        if (temp && temp.length) {
          messageSecond = 'hihihi';
        } else {
          messageSecond = null;
        }
      }

      return res.status(200).json({
        message,
        messageSecond,
        habitSet,
        achievementData,
        missedNoti,
      });

    } catch (error) {
      console.error(error);
      return next(error)
    }
  },


  habit_today: async (req, res, next) => {
    try {

      const today = moment().format('YYYY-MM-DD');

      const data = {};
      data.alarmSet = {
        habitName: req.habitName,
        date: today,
        pastAlarm: [],
        futureAlarm: [],
      };

      const notificationIdSet = await Notification.findAll({
        attributes: ['id'],
        where: { habitId: req.habitId },
        raw: true,
      });
      const notiIdSet = await notificationIdSet.map(data => data.id);
      const pastDataSet = await find_receivedData_today(notiIdSet);

      for (let i=0; i < pastDataSet.length; i++) {
        data.alarmSet.pastAlarm.push({
          time:  pastDataSet[i]['time'],
          is_done: pastDataSet[i]['is_done'],
        })
      }

      const noti_detail = await Noti_detail.findAll({
        attributes: ['time', 'endTime', 'repeat', 'weekId'],
        where: {
          notificationId: {[Op.or]: notiIdSet},
          weekId: 2 ** moment(today).format('e'),
        },
        raw: true,
      });

      if (noti_detail.length) {
        noti_detail.forEach(r => {
          if (r.endTime) {
            const end_time = moment(r.endTime, 'HH:mm').format('HH:mm');
            for (let start_time = moment(r.time, 'HH:mm').format('HH:mm');
                 start_time <= end_time;
                 start_time = moment(start_time, 'HH:mm').add(Number(r.repeat), 'm').format('HH:mm')
            ) {
              if (start_time > moment().format(('HH:mm'))) {
                data.alarmSet.futureAlarm.push({
                  time: start_time,
                  is_done: 0,
                });
              }
            }
          } else {
            if (r.time > moment().format(('HH:mm'))) {
              data.alarmSet.futureAlarm.push({
                time: r.time,
                is_done: 0
              })
          }
        }})
      }

      return res.status(200).json({
        data
      })

    } catch (error) {
      console.error(error);
      next(error);
    }
  },


  // habit data page
  habit_monthly_data_all: async (req, res, next) => {
    try {
      const year = req.params.year;
      const month = req.params.month;
      const totalHabitSet = await Habit.findAll({
        attributes: ['id', 'habitName', 'is_activated', 'updatedAt'],
        where: {
          userId: req.user.id,
        },
        include: [{
          model: Habit_icon,
          as: 'habit_icon',
          attributes: ['icon']
        }],
        raw: true,
        order: [['is_activated', 'DESC'], 'id']
      });

      const totalHabitIdSet = await totalHabitSet.map(d => d.id);
      const notificationIdSet = await Notification.findAll({
        attributes: ['id'],
        where: { habitId: {[Op.or]: totalHabitIdSet} },
        raw: true,
      });
      const notiIdSet = await notificationIdSet.map(data => data.id);

      const receivedData = notiIdSet.length? await find_receivedData_monthly(notiIdSet, year, month) : [];

      const calendarData = {};
      const graphData = {};
      const data = {
        habit : {
          monthTotal: 0,
          monthDone: 0,
          monthFalse: 0
        },
      };

      const date = year + '-' + month;
      const endDate = moment(date, "YYYY-MM").daysInMonth();

      for (let d=1; d <= endDate; d++) {
        calendarData[d] = {
          habit: [],
        };
        graphData[d] = {
          achievementData: {
            dailyTotal: 0, dailyDone: 0, dailyFalse: 0
          }
        };
      };

      for (let j=0; j < receivedData.length; j++) {
        const eachReceivedData = receivedData[j];
        data.habit.monthTotal += 1;
        let dayInfo = moment(eachReceivedData.date).format('DD');
        if (Number(dayInfo) < 10) {
          dayInfo = dayInfo.slice(1,2);
        }

        calendarData[dayInfo].habit.push({
          habitId: eachReceivedData["noti_detail.habitId"],
          habitName: eachReceivedData["noti_detail.habitName"]
        });
        graphData[dayInfo].achievementData.dailyTotal += 1;
        if (eachReceivedData.is_done) {
          data.habit.monthDone += 1;
          graphData[dayInfo].achievementData.dailyDone += 1;
        } else {
          data.habit.monthFalse += 1;
          graphData[dayInfo].achievementData.dailyFalse += 1;
        }
      }

      for (let dd=1; dd <= endDate; dd++) {
        calendarData[dd].habit = await uniqBy(calendarData[dd].habit, i=>i.habitId);
      }

      return res.status(200).json({
        data,
        habit: totalHabitSet,
        calendarData,
        graphData,
      })
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  habit_monthly_data: async (req, res, next) => {
    try {
      const year = req.params.year;
      const month = req.params.month;
      const habit = await Habit.findOne({
        attributes: ['id', 'habitName', 'is_activated', 'updatedAt',],
        where: {
          id: req.habitId,
        },
        include: [{
          model: Habit_icon,
          as: 'habit_icon',
          attributes: ['icon']
        }],
        raw: true,
      });

      const notificationIdSet = await Notification.findAll({
        attributes: ['id'],
        where: { habitId: req.habitId },
        raw: true,
      });
      const notiIdSet = await notificationIdSet.map(data => data.id);
      // const receivedData = await find_receivedData_monthly(notiIdSet, year, month);
      const receivedData = notiIdSet.length? await find_receivedData_monthly(notiIdSet, year, month) : [];

      const data = {
        habit: {
          'd+day': moment().diff(moment(habit.updatedAt).format('YYYY-MM-DD'), 'days'),
          habitName: habit.habitName,
          habitIcon: habit["habit_icon.icon"],
          monthTotal: 0,
          monthDone: 0,
          monthFalse: 0
        }
      };

      if (habit.createdAt !== habit.updatedAt) {
        data["habit"].message = "재도전하고 있는 습관입니다."
      } else if (!habit.is_activated) {
        data["habit"].message = "비활성화 된 습관입니다."
      }

      const graphData = {};
      const findMaxTemp = {};
      const date = year + '-' + month;
      const endDate = moment(date, "YYYY-MM").daysInMonth();
      for (let d=1; d <= endDate; d++) {
        graphData[d] = {
          achievementData: {
            dailyTotal: 0, dailyDone: 0, dailyFalse: 0
          }
        };
        findMaxTemp[d] = 0;
      }

      for (let j=0; j < receivedData.length; j++) {
        const eachReceivedData = receivedData[j];
        data.habit.monthTotal += 1;
        let dayInfo = moment(eachReceivedData.date).format('DD');
        if (Number(dayInfo) < 10) {
          dayInfo = dayInfo.slice(1,2);
        }
        graphData[dayInfo].achievementData.dailyTotal += 1;
        findMaxTemp[dayInfo] += 1;
        if (eachReceivedData.is_done) {
          data.habit.monthDone += 1;
          graphData[dayInfo].achievementData.dailyDone += 1;
        } else {
          data.habit.monthFalse += 1;
          graphData[dayInfo].achievementData.dailyFalse += 1;
        }
      }

      data.habit.monthMax = Math.max(...Object.values(findMaxTemp));

      let perfectlyDone = 0;
      for (let d=1; d <= endDate; d++) {
        if (graphData[d].achievementData.dailyDone) {
          if (graphData[d].achievementData.dailyDone >= graphData[d].achievementData.dailyTotal) {
            perfectlyDone += 1
          }
        }
      }

      data.habit.perfectlyDone = perfectlyDone;

      return res.status(200).json({
        data,
        graphData,
      })
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  habit_weekly_data: async (req, res, next) => {
    try {
      const sunday = moment().day(0).format('YYYY-MM-DD');
      const saturday = moment().day(6).format('YYYY-MM-DD');

      const data = {};
      data.achievementData = {nowTotal: 0, nowDone: 0, nowFalse: 0, maxCnt: 0};
      const habit = await Habit.findOne({
        attributes: [['updatedAt', 'd_day']],
        where: { id: req.habitId },
        raw: true
      });
      data.achievementData.d_day = moment().diff(moment(habit.d_day).format('YYYY-MM-DD'), 'days');
      const end_day = moment(saturday, 'YYYY-MM-DD').format('MM.DD');
      for (let start_day = moment(sunday, 'YYYY-MM-DD').format('MM.DD');
           start_day <= end_day;
           start_day = moment(start_day, 'MM.DD').add(1, 'd').format('MM.DD')
      ) {
        const weekId = moment(start_day, 'MM.DD').format('e');
        data[2 ** weekId] = {dayInfo: start_day, time: []};
      }

      const notificationIdSet = await Notification.findAll({
        attributes: ['id'],
        where: { habitId: req.habitId },
        raw: true,
      });
      const notiIdSet = await notificationIdSet.map(data => data.id);
      const pastDataSet = await find_receivedData_weekly(notiIdSet, sunday, saturday);
      let findMaxCnt = {1:0, 2:0, 4:0, 8:0, 16:0, 32:0, 64:0};
      for (let i=0; i < pastDataSet.length; i++) {
        const testIdx = pastDataSet[i];
        data.achievementData.nowTotal += 1;
        if (testIdx.is_done === 1) {
          data.achievementData.nowDone += 1;
          findMaxCnt[testIdx['noti_detail.weekId']] += 1
        } else {
          data.achievementData.nowFalse += 1;
        }
        data[testIdx['noti_detail.weekId']].time.push({
          time: testIdx['time'],
          is_done: testIdx['is_done'],
        })
      }
      let arr = Object.values(findMaxCnt);
      data.achievementData.maxCnt = Math.max(...arr);
      const weekIdx = moment().format('d');
      for (let i = weekIdx; i <= 6; i++) {
        const noti_detail = await Noti_detail.findAll({
          attributes: ['time', 'endTime', 'repeat', 'weekId'],
          where: {
            notificationId: {[Op.or]: notiIdSet},
            weekId: 2 ** i,
          },
          raw: true,
        });

        if (noti_detail !== []) {
          if (i === weekIdx) {
            noti_detail.forEach(r => {
              if (r.time > moment().format('HH:mm')) {
                const tempWeek = r.weekId;
                if (r.endTime) {
                  const end_time = moment(r.endTime, 'HH:mm').format('HH:mm');
                  for (let start_time = moment(r.time, 'HH:mm').format('HH:mm');
                       start_time <= end_time;
                       start_time = moment(start_time, 'HH:mm').add(Number(r.repeat), 'm').format('HH:mm')
                  ) {
                    data[tempWeek]["time"].push({
                      time: start_time,
                      is_done: 0,
                    });
                  }
                } else {
                  data[tempWeek]["time"].push({
                    time: r.time,
                    is_done: 0
                  });
                }
              }
            })
          } else {
            noti_detail.forEach(r => {
              const tempWeek = r.weekId;
              if (r.endTime) {
                const end_time = moment(r.endTime, 'HH:mm').format('HH:mm');
                for (let start_time = moment(r.time, 'HH:mm').format('HH:mm');
                     start_time <= end_time;
                     start_time = moment(start_time, 'HH:mm').add(Number(r.repeat), 'm').format('HH:mm')
                ) {
                  data[tempWeek]["time"].push({
                    time: start_time,
                    is_done: 0,
                  });
                }
              } else {
                data[tempWeek]["time"].push({
                  time: r.time,
                  is_done: 0
                });
              }
            });
          }
        }
      }
      return res.status(200).json({
        data
      })
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  habit_daily_data_all: async (req, res, next) => {
    try {
      let thisDay = req.params.year + '-' + req.params.month + '-' + req.params.day;

      const notiDetailSet = await Noti_detail.findAll({
        attributes: [ 'id', 'notificationId', 'habitName', 'time', 'endTime', 'repeat'],
        where: {
          weekId: 2 ** moment(thisDay).format('e'),
        },
        include: [{
          model: Habit,
          as: 'habit',
          attributes: ['id'],
          where: { userId: req.user.id }
        }],
        raw: true,
      });

      const notiIdSet = await notiDetailSet.map(data => data.notificationId);
      const receivedData = await find_all_receivedData_daily(notiIdSet, thisDay);
      const data = {
        achievementData: {
          dailyTotal: 0,
          dailyDone: 0,
          dailyFalse: 0
        },
        habit: {
          doll: [],
          habitName: [],
        },
      };

      let alarmSet = {};
      let habitIdSet = [];
      let dollIdSet = [];
      for (let j=0; j < receivedData.length; j++) {
        data.achievementData.dailyTotal += 1;
        if (!dollIdSet.includes(receivedData[j]['dollId'])) {
          dollIdSet.push(receivedData[j]['dollId']);
          data.habit.doll.push(receivedData[j]['doll.dollName'])
        }
        if (!habitIdSet.includes(receivedData[j]['noti_detail.habitId'])) {
          habitIdSet.push(receivedData[j]['noti_detail.habitId']);
          data.habit.habitName.push(receivedData[j]['noti_detail.habitName']);
          alarmSet[receivedData[j]['noti_detail.habitName']] = [];
        }
        alarmSet[receivedData[j]['noti_detail.habitName']].push({
          id: receivedData[j].id,
          time: receivedData[j].time,
          is_done: receivedData[j].is_done,
        });
        if (receivedData[j].is_done) {
          data.achievementData.dailyDone += 1;
        } else {
          data.achievementData.dailyFalse += 1;
        }
      }

      if (moment(thisDay).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
        if (notiDetailSet.length) {
          notiDetailSet.forEach(r => {
            const habitName = String(r.habitName);
            if (!alarmSet[habitName]) {
              alarmSet[habitName] = [];
              data.habit.habitName.push(habitName);
            }
            if (r.endTime) {
              const end_time = moment(r.endTime, 'HH:mm').format('HH:mm');
              for (let start_time = moment(r.time, 'HH:mm').format('HH:mm');
                   start_time <= end_time;
                   start_time = moment(start_time, 'HH:mm').add(Number(r.repeat), 'm').format('HH:mm')
              ) {
                if (start_time > moment().format(('HH:mm'))) {
                  data.achievementData.dailyTotal += 1;
                  data.achievementData.dailyFalse += 1;
                  alarmSet[habitName].push({
                    time: start_time,
                    is_done: 0,
                  });
                }
              }
            } else {
              if (r.time > moment().format(('HH:mm'))) {
                data.achievementData.dailyTotal += 1;
                data.achievementData.dailyFalse += 1;
                alarmSet[habitName].push({
                  time: r.time,
                  is_done: 0
                })
              }
            }
          })
        }
      }


      return res.status(200).json({
        dayInfo: thisDay,
        data,
        alarmSet,
      })
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  habit_daily_data: async (req, res, next) => {
    try {
      const thisDay = req.params.year + '-' + req.params.month + '-' + req.params.day;
      const notiDetailSet = await Noti_detail.findAll({
        attributes: [ 'id', 'notificationId', 'habitName', 'time', 'endTime', 'repeat'],
        where: {
          habitId: req.habitId,
          weekId: 2 ** moment(thisDay).format('e'),
        },
        raw: true,
      });
      const notiIdSet = await notiDetailSet.map(data => data.notificationId);
      const receivedData = await find_receivedData_daily(notiIdSet, thisDay);
      const data = {
        habit: {
          doll: [],
          dailyTotal: 0,
          dailyDone: 0,
          dailyFalse: 0
        },
      };
      let dollIdSet = [];
      for (let j=0; j < receivedData.length; j++) {
        data.habit.dailyTotal += 1;
        if (!dollIdSet.includes(receivedData[j]['dollId'])) {
          dollIdSet.push(receivedData[j]['dollId']);
          data.habit.doll.push(receivedData[j]['doll.dollName'])
        }
        if (receivedData[j].is_done) {
          data.habit.dailyDone += 1;
        } else {
          data.habit.dailyFalse += 1;
        }
        delete receivedData[j]['dollId'];
        delete receivedData[j]['doll.dollName'];
      }

      if (moment(thisDay).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
        if (notiDetailSet.length) {
          notiDetailSet.forEach(r => {

            if (r.endTime) {
              const end_time = moment(r.endTime, 'HH:mm').format('HH:mm');
              for (let start_time = moment(r.time, 'HH:mm').format('HH:mm');
                   start_time <= end_time;
                   start_time = moment(start_time, 'HH:mm').add(Number(r.repeat), 'm').format('HH:mm')
              ) {
                if (start_time > moment().format(('HH:mm'))) {
                  data.habit.dailyTotal += 1;
                  data.habit.dailyFalse += 1;
                  receivedData.push({
                    time: start_time,
                    is_done: 0,
                  });
                }
              }
            } else {
              if (r.time > moment().format(('HH:mm'))) {
                data.habit.dailyTotal += 1;
                data.habit.dailyFalse += 1;
                receivedData.push({
                  time: r.time,
                  is_done: 0
                })
              }
            }
          })
        }
      }
      return res.status(200).json({
        dayInfo: thisDay,
        data,
        alarmSet: receivedData,
      })
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // habit CRUD
  create_habit: async (req, res, next) => {
    const {habitName, habitIconId} = req.body;

    try {
      await Habit.create({
        habitName,
        userId: req.user.id,
        habitIconId,
      });
      return res.status(200).json({
        message: '새로운 습관이 등록되었습니다.',
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },

  habit_detail: async (req, res, next) => {
    try {
      await Habit.findAll({
        attributes: ['id', 'habitName', 'is_activated', 'weekId', ['updatedAt', 'd_day'],
        ],
        where: {userId: req.user.id},
        order: ['createdAt', 'is_activated'],
        include: [{
          model: Habit_icon,
          as: 'habit_icon',
          attributes: ['icon']
        }],
        raw: true,
      }).then(res => {
        res.forEach(d => {
          if (d.is_activated) {
            d.d_day = moment().diff(moment(d.d_day).format('YYYY-MM-DD'), 'days');
          } else {
            d.d_day = 0;
          }
        });
        return res
      }).then(habit => {
        res.status(200).json({
          habit,
        });
      }).catch(error => {
        console.error(error);
        next(error);
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  activate_habit: async (req, res, next) => {
    try {
      const habit = await Habit.findByPk(req.habitId);

      habit.is_activated ? habit.is_activated = false : habit.is_activated = true;
      habit.save();

      return res.status(200).json({
        habit: {
          id: habit.id,
          is_activated: habit.is_activated,
        },
      })
    } catch (error) {
      console.error(error);
      return next(error)
    }
  },

  update_habit: async (req, res, next) => {
    try {
      const {habitName} = req.body;
      const habit = await Habit.findByPk(req.habitId);

      habit.habitName = habitName;
      habit.save({fields: ['habitName'], silent: true});

      const notiDetailSet = await Noti_detail.findAll({
        where: {habitId: habit.id},
      });

      await notiDetailSet.forEach(noti => {
        noti.habitName = habitName;
        noti.save();
      });
      
      return res.status(200).json({
        message: '습관명이 변경되었습니다.'
      })
      
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  delete_habit: async (req, res, next) => {
    try {
      const habit = await Habit.findByPk(req.params.habitId);

      habit.destroy();

      return res.status(200).json({
        message: '습관 삭제 완료',
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // notification CRUD
  create_noti: async (req, res, next) => {
    const {weekId, time, endTime, repeat, dollId} = req.body;
    const exHabit = await Habit.findByPk(req.params.habitId);

    let cnt = 1;
    if (endTime !== "" && repeat !== 0) {
      cnt = await repeatCnt(time, endTime, repeat);
    }

    if ( weekId !== null && time !== null && dollId !== null ) {
      Notification.create({
        weekId,
        time,
        endTime,
        repeat,
        habitId: req.habitId,
        dollId,
        cnt
      }).then(async newNoti => {
        req.notiId = newNoti.id;
        req.dollId = newNoti.dollId;

        let temp_habit_weekId = exHabit.weekId;
        for (let i = 0; i <= 6; i++) {
          if (weekId & (1 << i)) {
            await create_noti_detail(2**i, newNoti, req.habitName, cnt);
            temp_habit_weekId |= (1 << i);
          }
        }

        return temp_habit_weekId
      }).then(temp_habit_weekId => {
        exHabit.weekId = temp_habit_weekId;
        exHabit.save({fields: ['weekId'], silent: true});

        rasp_create(req, res, next);

      }).catch (error => {
        console.error(error);
        return next(error);
      });
    } else {
      return res.status(400).json({
        message: '알람을 생성하기위한 정보가 부족합니다.'
      })
    }
  },

  noti_detail: async (req, res, next) => {
    try {
      const habitId = req.habitId;
      const dollIdSet = await Doll.findAll({
        attributes: [ ['id', 'dollId'] ],
        where: { userId: req.user.id },
        raw: true,
      });

      const data = {};
      for (let i=0; i < dollIdSet.length; i++) {
        // data[dollIdSet[i].dollId] = 1;
        const temp = await Notification.findAll({
          attributes: ['id', 'weekId', 'time', 'endTime', 'repeat'],
          where: { habitId, dollId: dollIdSet[i].dollId },
          order: ['time'],
          raw: true
        });

        for (let j=0; j < temp.length; j++) {
          // const notiIdSet = await temp[j].map(h => h.id);
          const alarmSet = await find_alarm(temp[j].id);
          temp[j].alarmSet = alarmSet;
        }

        data[dollIdSet[i].dollId] = temp;
      }

      return res.status(200).json({
        data,
      });

    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  update_noti: async (req, res, next) => {
    try {
      const {weekId, time, endTime, repeat, dollId} = req.body;
      const exNoti = await Notification.findByPk(req.noti.id);
      const habit = await Habit.findByPk(req.habitId);

      let cnt = 1;
      if (endTime) {
        cnt = await repeatCnt(time, endTime, repeat);
      }

      exNoti.weekId = weekId;
      exNoti.time = time;
      exNoti.endTime = endTime;
      exNoti.repeat = repeat;
      exNoti.dollId = dollId;
      exNoti.cnt = cnt;
      exNoti.save().then(async newNoti => {
        req.notiId = newNoti.id;
        req.dollId = newNoti.dollId;

        for (let i = 0; i <= 6; i++) {
          if (weekId & (1 << i)) {
            await create_noti_detail(2**i, newNoti, req.habitName, cnt);
          }
        }
      }).then(async go => {
        habit.weekId = await make_habit_weekId(req.habitId);
        habit.save({fields: ['weekId'], silent: true});

        await rasp_create(req, res, next)
      }).catch (error => {
        console.error(error);
        return next(error);
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  delete_noti: async (req, res, next) => {
    const habit = await Habit.findByPk(req.habitId);

    try {
      const noti = await Notification.findByPk(req.noti.id);
      await noti.destroy();
      habit.weekId = await make_habit_weekId(req.habitId);
      habit.save({fields: ['weekId'], silent: true});

      return res.status(200).json({
        message: '알람 삭제 완료'
      })
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // received Data 수정 및 삭제
  update_received_data: async (req, res, next) => {
    try {
      const received_data = await Received_data.findOne({
        attributes: ['dollId'],
        where: {id: req.params.dataId},
        raw: true,
      });

      if (received_data) {
        const doll = await Doll.findOne({
          attributes: ['userId'],
          where: { id: received_data.dollId },
          raw: true,
        });
      
        if (doll.userId === req.user.id) {
          const reData = await Received_data.findByPk(req.params.dataId);
          reData.is_done ? reData.is_done = false : reData.is_done = true;
          reData.save({fields: ['is_done']});

          return res.status(200).json({
            message: '수정 되었습니다.'
          })
        } else {
          return res.status(403).json({
            message: '권한이 없습니다.'
          })
        }
      } else {
        return res.status(403).json({
          message: '존재하지 않는 데이터 입니다.'
        })
      }
    } catch(error) {
      console.error(error);
      next(error);
    }
  },

  delete_received_data: async (req, res, next) => {
    try {
      const received_data = await Received_data.findByPk(req.params.dataId);

      if (received_data) {
        const doll = await Doll.findByPk(received_data.dollId);

        if (doll.userId === req.user.id) {
          received_data.destroy();

          return res.status(200).json({
            message: '삭제 되었습니다.'
          })
        } else {
          return res.status(403).json({
            message: '권한이 없습니다.'
          })
        }
      } else {
        return res.status(403).json({
          message: '존재하지 않는 데이터 입니다.'
        })
      }
    } catch(error) {
      console.error(error);
      next(error);
    }
  },

  // noti_week_detail: async (req, res, next) => {
  //   // 습관에서,
  //   // 인형 별로 구분이 되어 있고,
  //   // 요일별로 구분 된 다음,
  //   // noti_detail 에 repeat 가 포함 된 시간 묶음
  //
  //   try {
  //     const habitId = req.habitId;
  //     const dollIdSet = await Doll.findAll({
  //       attributes: [ ['id', 'dollId'] ],
  //       where: { userId: req.user.id },
  //       raw: true,
  //     });
  //
  //     const data = {};
  //     for (let i=0; i < dollIdSet.length; i++) {
  //       const notification = await Notification.findAll({
  //         attributes : ['id'],
  //         where : { habitId, dollId: dollIdSet[i].dollId },
  //         raw: true
  //       });
  //       const notiIdSet = await notification.map(h => h.id);
  //       console.log(i);
  //       data[dollIdSet[i].dollId] = await find_alarm(notiIdSet);
  //     }
  //
  //     return res.status(200).json({
  //       data,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return next(error);
  //   }
  // },
};
