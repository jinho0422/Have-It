const { User, Doll, Device } = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
/**
 * @swagger
 *  /user/{userName}/:
 *    get:
 *      tags:
 *      - User
 *      description: user detail
 *      produces:
 *      - applicaion/json
 *      - application/xml
 *      parameters:
 *      - name: haveCookie
 *        in: cookie
 *        schema:
 *          type: string
 *      - name: userName
 *        in: path
 *        type: string
 *
 *      responses:
 *       200:
 *        description: 유저 상세 정보 페이지
 *
 *
 * @swagger
 *  /user/{userName}/:
 *    post:
 *      tags:
 *      - User
 *      description: user 정보 변경
 *      produces:
 *      - applicaion/json
 *      - application/xml
 *      parameters:
 *      - name: haveCookie
 *        in: cookie
 *        schema:
 *          type: string
 *      - name: userName
 *        in: path
 *        type: string
 *      - in: body
 *        name: user_data
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - nickName
 *          example: {"nickName":"Jay", "email":"test@gmaail.com", "exPassword":"1234", "newPassword":"4321"}
 *
 *      responses:
 *       200:
 *        description: 유저 정보 업데이트 완료 메시지
 *
 *
 * @swagger
 *  /user/{userName}/:
 *    delete:
 *      tags:
 *      - User
 *      description: 회원 탈퇴
 *      produces:
 *      - applicaion/json
 *      - application/xml
 *      parameters:
 *      - name: haveCookie
 *        in: cookie
 *        schema:
 *          type: string
 *      - name: userName
 *        in: path
 *        type: string
 *
 *      responses:
 *       200:
 *        description: 탈퇴 완료 메시지
 *
 */

  user_detail: async (req, res, next) => {
    try {
      const user = await User.findOne({
        attributes: ['userName', 'nickName', 'email', 'id'],
        where: { userName: req.params.userName },
        raw: true,
      });

      if (user && user.id === req.user.id) {
        const doll = await Doll.findAll({
          attributes: ['id', 'serialNumber', 'dollName', 'is_activated'],
          where: { userId: req.user.id },
          include: [{
            attributes: ['machineName'],
            model: Device
          }]
        });

        delete user.id;

        return res.status(200).json({
          user,
          doll,
        })
      } else {
        return res.status(403).json({
          message: '권한이 없습니다.'
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  update_user: async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { userName: req.params.userName },
      });

      if (user && user.id === req.user.id) {
        const { nickName, email, exPassword, newPassword } = req.body;
        if (nickName) {user.nickName = nickName;}
        if (email) {user.email = email;}
        if (exPassword && newPassword) {
          const result = await bcrypt.compare(exPassword, user.password);
          if (result) {
            user.password = await bcrypt.hash(newPassword, 12);
          } else {
            return res.status(403).json({
              message: '비밀번호가 일치하지 않습니다.'
            })
          }
        } else if (exPassword || newPassword) {
          return res.status(403).json({
            message: '회원 정보를 변경할 데이터가 부족합니다.'
          })
        }

        await user.save();

        return res.status(200).json({
          message: '회원 정보가 변경되었습니다.'
        })
      } else {
        return res.status(403).json({
          message: '권한이 없습니다.'
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  delete_user: async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { userName: req.params.userName },
      });

      if (user && user.id === req.user.id) {
        const dollSet = await Doll.findAll({
          where: { userId: req.user.id },
        });
        if (dollSet.length) {
          return res.status(403).json({
            message: '회원 탈퇴는 연결 된 인형이 없는 경우에만 가능합니다. 인형을 모두 초기화 시켜주세요.'
          })
        } else {
          user.destroy();
          res.clearCookie('haveCookie');
          return res.status(200).json({
            message: '회원 탈퇴 성공'
          });
        }
      } else {
        return res.status(403).json({
          message: '권한이 없습니다.'
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // update_password: async (req, res, next) => {
  //   try {
  //     const user = await User.findByPk(req.params.userId);
  //
  //     if (user && user.id === req.user.id) {
  //       const { exPassword, newPassword } = req.body;
  //       const result = await bcrypt.compare(exPassword, user.password);
  //       if (result) {
  //         user.password = await bcrypt.hash(newPassword, 12);
  //         user.save();
  //         return res.status(200).json({
  //           message: '비밀번호가 변경되었습니다.'
  //         });
  //       } else {
  //         res.status(400).json({
  //           message: '비밀번호가 일치하지 않습니다.'
  //         })
  //       }
  //     } else {
  //       res.status(400).json({
  //         message: '권한이 없습니다.'
  //       })
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     next(error);
  //   }
  // },

};