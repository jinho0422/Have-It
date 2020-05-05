const { Habit, Noti_detail, Doll, Notification } = require('../models');
const request = require('request');
const { uniqBy } = require('../routes/functions');


exports.rasp_status = async (req, res, next) => {
  try {
    let doll = {};

    if (req.noti) {
      doll = await Doll.findByPk(req.noti.dollId);
    } else if (req.params.dollId) {
      doll = await Doll.findByPk(req.params.dollId);
    } else if (req.body.dollId) {
      doll = await Doll.findByPk(req.body.dollId);
    } else {
      return res.status(403).json({
        message: '유효하지 않은 요청입니다.'
      })
    }

    if (doll) {
      await request.get({
        url: doll.domain + '/check/',
      }, function (err, response, body) {
        if (err) {
          console.error(err);
          return res.status(403).json({
            message: '인형과의 연결이 불안정합니다. 인형의 상태를 확인해 주세요.'
          })
        }
        if (response && response.statusCode === 200) {
          return next()
        } else {
          return res.status(403).json({
            message: '인형과의 연결이 불안정합니다. 인형의 상태를 확인해 주세요.'
          })
        }
      })
    } else {
      return res.status(403).json({
        message: '존재하지 않는 인형입니다.'
      })
    }
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: '인형과의 연결이 불안정합니다. 인형의 상태를 확인해 주세요.'
    })
  }
};


exports.rasp_create = async (req, res, next) => {
  try {
    const {domain} = await Doll.findByPk(req.dollId);

    const noti_detail = await Noti_detail.findAll({
      attributes: {exclude: ['cnt']},
      where: { notificationId: req.notiId }
    });

    await request.post({
      url: domain + '/alarm/insert/',
      body: noti_detail,
      json: true,
    }, function (err, response, body) {
      if (err) {
        console.error(err);
        next(err);
      }
      else if (response && response.statusCode === 200) {
        return res.status(200).json({
          message: '알람이 생성/변경 되었습니다.'
        })
      } else {
        return res.status(400).json({
          message: '인형에 알람이 생성/변경되지 않았습니다. 연결 상태를 확인하고 인형과 알람 동기화를 해주세요.'
        })
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};


exports.rasp_delete = async (req, res, next) => {
  try {
    const { domain } = await Doll.findByPk(req.noti.dollId);
    await request.delete({
      url: domain + '/alarm/delete/' + req.noti.id,
    }, function (err, response, body) {
      if (response && response.statusCode === 200) {
        return next()
      } else {
        return res.status(400).json({
          message: '인형과의 연결이 불안정합니다. 연결을 확인해주세요.'
        })
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


exports.rasp_habit_activate = async (req, res, next) => {
  try {
    const notiSet = await Notification.findAll({
      attributes: ['dollId'],
      where: {habitId: req.habitId},
      raw: true,
    });

    const habit = await Habit.findByPk(req.habitId);

    let status = 0;
    habit.is_activated ? status = false : status = true;

    const data = {
      habitId: req.habitId,
      is_activated: status,
    };

    const dollIdSet = await uniqBy(await notiSet.map(d => d.dollId), k=>k);

    for (let i=0; i < dollIdSet.length; i++) {
      const doll = await Doll.findByPk(dollIdSet[i]);
      await request.post({
        url: doll.domain + '/habit/activate/',
        body: data,
        json: true,
      }, function (err, response, body) {
        if (err) {
          console.error(err);
          return res.status(403).json({
            message: '습관 설정 변경은 인형이 켜져있는 경우에만 가능합니다. 인형의 상태를 확인해 주세요.'
          })
        }
        else if (!response && response.statusCode !== 200) {
          return res.status(400).json({
            message: '습관 설정 변경은 인형이 켜져있는 경우에만 가능합니다. 인형의 상태를 확인해 주세요.'
          })
        } else if (response && response.statusCode === 200) {
          return next();
        }
      });
    }

  } catch (error) {
    console.error(error);
    next(error);
  }
};


exports.rasp_habit_update = async (req, res, next) => {
  try {
    const notiSet = await Notification.findAll({
      attributes: ['dollId'],
      where: {habitId: req.habitId},
      raw: true,
    });
    const { habitName } = req.body;
    const data = {
      habitId: req.habitId,
      habitName
    };

    const dollIdSet = await uniqBy(await notiSet.map(d => d.dollId), k=>k);

    for (let i=0; i < dollIdSet.length; i++) {
      const doll = await Doll.findByPk(dollIdSet[i]);
      await request.post({
        url: doll.domain + '/habit/name/',
        body: data,
        json: true,
      }, function (err, response, body) {
        if (err) {
          console.error(err);
          return res.status(403).json({
            message: '습관 수정 및 삭제는 인형이 켜져있는 경우에만 가능합니다. 인형의 상태를 확인해 주세요.'
          })
        }
        if (!response && response.statusCode !== 200) {
          return res.status(400).json({
            message: '습관 수정 및 삭제는 인형이 켜져있는 경우에만 가능합니다. 인형의 상태를 확인해 주세요.'
          })
        } else if (response && response.statusCode === 200) {
          return next();
        }
      });
    }

  } catch (error) {
    console.error(error);
    next(error);
  }
};


exports.rasp_habit_delete = async (req, res, next) => {
  try {
    const notiSet = await Notification.findAll({
      attributes: ['dollId'],
      where: {habitId: req.habitId},
      raw: true,
    });

    const dollIdSet = await uniqBy(await notiSet.map(d => d.dollId), k=>k);

    for (let i=0; i < dollIdSet.length; i++) {
      const doll = await Doll.findByPk(dollIdSet[i]);
      await request.delete({
        url: doll.domain + '/habit/delete/' + req.habitId,
      }, function (err, response, body) {
        if (err) {
          console.error(err);
          return res.status(403).json({
            message: '습관 수정 및 삭제는 인형이 켜져있는 경우에만 가능합니다. 인형의 상태를 확인해 주세요.'
          })
        }
        else if (!response && response.statusCode !== 200) {
          return res.status(400).json({
            message: '습관 수정 및 삭제는 인형이 켜져있는 경우에만 가능합니다. 인형의 상태를 확인해 주세요.'
          })
        } else if (response && response.statusCode === 200) {
          return next();
        }
      });
    }

  } catch (error) {
    console.error(error);
    next(error);
  }
};