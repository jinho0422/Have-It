const { User, Habit, Notification } = require('../models');

module.exports = {
  /**
   * @swagger
   *  /admin/restore/user/{userId}/:
   *    get:
   *      tags:
   *      - Admin
   *      description: 유저 복구
   *      produces:
   *      - application/xml
   *      parameters:
   *      - name: userId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 습관 복구
   *
   * @swagger
   *  /admin/restore/habit/{habitId}/:
   *    get:
   *      tags:
   *      - Admin
   *      description: 습관 복구
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
   *        description: 습관 복구
   *
   * @swagger
   *  /admin/restore/noti/{notificationId}/:
   *    get:
   *      tags:
   *      - Admin
   *      description: 습관 알람 복구
   *      produces:
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: notificationId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 습관 알람 복구
   */


  // 관리자 복구 권한 및 디버깅용
  restore_habit: async (req, res, next) => {
    try {
      Habit.restore({
        where: {id: req.params.habitId}
      });
      const habit = await Habit.findByPk(req.params.habitId);

      return res.status(200).json({
        message: '습관 복구 완료',
        habit,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  restore_noti: async (req, res, next) => {
    try {
      Notification.restore(id=req.params.notificationId);
      const noti = await Notification.findByPk(req.params.notificationId);

      return res.status(200).json({
        message: '알람 복구 완료',
        noti,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },


  restore_user: async (req, res, next) => {
    try {
      User.restore(id=req.params.userId);

      return res.status(200).json({
        message: '유저 복구 완료',
        // user,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};