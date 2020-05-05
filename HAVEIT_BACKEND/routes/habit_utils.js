const {Habit, Notification, Noti_detail} = require('../models');


exports.get_noti = async (req, res, next) => {
  try {
    const noti = await Notification.findByPk(req.params.notificationId);
    if (noti) {
      // console.log(noti);
      req.noti = noti;
      return next();
    } else {
      res.status(403).json({
        message: '존재하지 않는 알람입니다.'
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};


exports.get_habit = async (req, res, next) => {
  try {
    const habit = await Habit.findByPk(req.params.habitId);

    if (!habit) {
      return res.status(403).json({
        message: '존재하지 않는 습관입니다.'
      })
    } else {
      if (req.user.id === habit.userId) {
        req.habitName = habit.habitName;
        req.habitId = req.params.habitId;
        return next();
      } else {
        return res.status(403).json({
          message: '권한이 없습니다.'
        })
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};


exports.delete_exNoti = async (req, res, next) => {
  try {
    await Noti_detail.findAll({
      where: { notificationId: req.noti.id },
    }).then(res => res.forEach(r => r.destroy()));
    return next()
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

