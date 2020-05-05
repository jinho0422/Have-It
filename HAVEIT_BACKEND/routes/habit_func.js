const moment = require('moment');
const {Doll, Notification, Noti_detail, Received_data} = require('../models');
const sequelize = require('sequelize');
const {Op} = require('sequelize');


exports.find_receivedData_monthly = async (notiIdSet, year, month) => {
  try {
    const date = year + '-' + month;
    const startDate = date + '-'+'01';
    const endDate = date + '-' + moment(date, "YYYY-MM").daysInMonth();

    return Received_data.findAll({
      attributes: [
        'notificationId', 'id', 'time', 'is_done', 'dollId',
        [sequelize.fn('DATE', sequelize.col('received_data.createdAt')), 'date'],
        // [sequelize.fn('COUNT', sequelize.col('received_data.updatedAt')), 'cnt_day'],
      ],
      where: {
        notificationId: {[Op.or]: notiIdSet},
        createdAt: {
          [Op.gte]: moment(startDate).format('YYYY-MM-DD'),
          [Op.lte]: moment(endDate).format('YYYY-MM-DD'),
        },
      },
      order: ['time'],
      include: [{
        model: Noti_detail,
        as: 'noti_detail',
        attributes: ['habitName', 'habitId'],
      }],
      raw: true,
    })
  } catch (error) {
    console.error(error);
    return {};
  }
};


exports.find_receivedData_weekly = async (notiIdSet, sunday, saturday) => {
  // console.log(notificationIdSet);
  // https://okky.kr/article/516156?note=1548516

  return Received_data.findAll({
    attributes: ['id', 'time', 'is_done', 'dollId',],
    // [sequelize.fn('DATE', sequelize.col('received_data.updatedAt')), 'date']],
    // group: ['date'],
    where: {
      notificationId: {[Op.or]: notiIdSet},
      // dollId: {[Op.or]: dollIdSet},
      // group: [sequelize.fn('date_trunc', 'day', sequelize.col('updatedAt'))],
      createdAt: {
        [Op.gte]: sunday,
        [Op.lte]: saturday,
      },
    },
    order: ['time'],
    include: [{
      model: Noti_detail,
      as: 'noti_detail',
      attributes: ['weekId'],
      // order: ['weekId']
    }],

    raw: true,
  })
};


exports.find_receivedData_today = async (notiIdSet) => {
  const startDate = moment().format('YYYY-MM-DD');
  const endDate = moment().add(1, 'd').format('YYYY-MM-DD');

  return Received_data.findAll({
    attributes: ['id', 'time', 'is_done', 'dollId'],
    where: {
      notificationId: {[Op.or]: notiIdSet},
      createdAt: {
        [Op.lt]: endDate,
        [Op.gte]: startDate,
      }
    },
    include: [{
      model: Noti_detail,
      as: 'noti_detail',
      attributes: ['habitName', 'habitId'],
    }],
    order: ['time'],
    raw: true,
  })
};


exports.find_receivedData_daily = async (notiIdSet, date) => {
  const startDate = moment(date).format('YYYY-MM-DD');
  const endDate = moment(date).add(1, 'd').format('YYYY-MM-DD');

  if (notiIdSet.length) {
    return Received_data.findAll({
      attributes: ['id', 'time', 'is_done', 'dollId'],
      where: {
        notificationId: {[Op.or]: notiIdSet},
        createdAt: {
          [Op.lt]: endDate,
          [Op.gte]: startDate,
        }
        // createdAt: {[Op.gte]: moment(date).format('YYYY-MM-DD')},
      },
      include: [
        {
          model: Doll,
          as: 'doll',
          attributes: ['dollName']
        }
      ],
      order: ['time'],
      raw: true,
    })
  } else {
    return [];
  }
};


exports.find_all_receivedData_daily = async (notiIdSet, date) => {
  const startDate = moment(date).format('YYYY-MM-DD');
  const endDate = moment(date).add(1, 'd').format('YYYY-MM-DD');

  if (notiIdSet.length) {
    return Received_data.findAll({
      attributes: ['id', 'time', 'is_done', 'dollId'],
      where: {
        notificationId: {[Op.or]: notiIdSet},
        createdAt: {
          [Op.lt]: endDate,
          [Op.gte]: startDate,
        },
      },
      include: [
        {
          model: Doll,
          as: 'doll',
          attributes: ['dollName']
        }, {
          model: Noti_detail,
          as: 'noti_detail',
          attributes: ['habitName', 'habitId']
        }
      ],
      order: ['time'],
      raw: true,
    })
  } else {
    return [];
  }
};


exports.find_alarm_daily = async (notiIdSet, weekId) => {
  let alarmSet = [];
  const noti_detail = await Noti_detail.findAll({
    attributes: ['time', 'endTime', 'repeat', 'weekId'],
    where: {
      notificationId: {
        [Op.or]: notiIdSet
      },
      weekId,
    },
    // order: ['notificationId'],
    raw: true,
  });
  if (noti_detail !== []) {
    noti_detail.forEach(r => {
      if (r.endTime) {
        const end_time = moment(r.endTime, 'HH:mm').format('HH:mm');
        for (let start_time = moment(r.time, 'HH:mm').format('HH:mm');
           start_time <= end_time;
           start_time = moment(start_time, 'HH:mm').add(Number(r.repeat), 'm').format('HH:mm')
        ) {
          alarmSet.push(start_time);
        }
      } else {
        alarmSet.push(r.time);
      }
    });
  }
  return alarmSet
};


exports.find_alarm = async (notiId) => {
  let alarmSet = {};
  for (let i = 0; i <= 6; i++) {
    const noti_detail = await Noti_detail.findAll({
      attributes: ['time', 'endTime', 'repeat', 'weekId'],
      where: {
        notificationId: notiId,
        weekId: 2 ** i,
      },
      // order: ['notificationId'],
      raw: true,
    });
    if (noti_detail !== []) {
      noti_detail.forEach(r => {
        const tempWeek = r.weekId;
        if (!alarmSet[tempWeek]) {
          alarmSet[tempWeek] = [];
        }
        if (r.endTime) {
          const end_time = moment(r.endTime, 'HH:mm').format('HH:mm');
          for (let start_time = moment(r.time, 'HH:mm').format('HH:mm');
               start_time <= end_time;
               start_time = moment(start_time, 'HH:mm').add(Number(r.repeat), 'm').format('HH:mm')
          ) {
            alarmSet[tempWeek].push(start_time);
          }
        } else {
          alarmSet[tempWeek].push(r.time);
        }
      });
    }
  }
  return alarmSet
};


exports.create_noti_detail = async (weekId, newNoti, habitName, cnt) => {
  try {
    await Noti_detail.create({
      weekId: weekId,
      time: newNoti.time,
      endTime: newNoti.endTime,
      repeat: newNoti.repeat,
      habitId: newNoti.habitId,
      cnt: cnt,
      habitName: habitName,
      notificationId: newNoti.id,
    })
  } catch (error) {
    console.error(error);
    return error
  }
};


exports.make_habit_weekId = async (habitId) => {
  try {
    const notidummy = await Notification.findAll({
      attributes: ['weekId'],
      where: { habitId },
      raw: true,
    });

    let temp_habit_weekId = 0;
    await notidummy.forEach(noti => {
      for (let i = 0; i <= 6; i++) {
        if (noti.weekId & (1 << i)) {
          temp_habit_weekId |= (1 << i);
        }
      }
    });

    return temp_habit_weekId;
  } catch (error) {
    console.error(error);
    return error;
  }
};