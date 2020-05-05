const bcrypt = require('bcrypt');
const { signJWT } = require('../routes/auth_utils');
const { User, Doll, Doll_icon } = require('../models');

// * @swagger
// * definitions:
//   *  user:
//   *   type: object
// *   required:
// *     - userName
// *     - password
// *     - email
// *     - nickName
// *   properties:
// *     id:
//   *       type: integer
// *       description: ObjectId
// *     userName:
// *       type: string
// *       description: 아이디
// *     password:
// *       type: string
// *       description: 비밀번호
// *     email:
// *       type: string
// *       description: 이메일 주소
// *     nickName:
// *       type: string
// *       description: 닉네임
// *

module.exports = {
  /**
   * @swagger
   *  /auth/signup/:
   *    post:
   *      tags:
   *      - Auth
   *      description: 회원가입
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: userName
   *        in: formData
   *        type: string
   *      - name: password
   *        in: formData
   *        type: string
   *      - name: email
   *        in: formData
   *        type: string
   *      - name: nickName
   *        in: formData
   *        type: string
   *
   *      responses:
   *       200:
   *        description: 회원가입 결과
   *
   * @swagger
   *  /auth/login/:
   *    post:
   *      tags:
   *      - Auth
   *      description: 로그인
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: userName
   *        in: formData
   *        type: string
   *      - name: password
   *        in: formData
   *        type: string
   *
   *      responses:
   *       200:
   *        description: 로그인 + 쿠키 자동 저장 + 인형에 인사말
   *
   * @swagger
   *  /auth/logout/:
   *    get:
   *      tags:
   *      - Auth
   *      description: 로그아웃
   *      produces:
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      responses:
   *       200:
   *        description: 저장되어있던 쿠키가 삭제 됩니다.
   *
   * @swagger
   *  /auth/check/:
   *    get:
   *      tags:
   *      - Auth
   *      description: 로그인 유무 확인
   *      produces:
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      responses:
   *       200:
   *        description: 체크 결과
   */

  signup: async (req, res, next) => {
    const {userName, password, email, nickName} = req.body;

    try {
      const exUser_name = await User.findOne({where: {userName}});
      if (exUser_name) {
        return res.status(400).json({
          message: '이미 가입 된 아이디 입니다.'
        });
      }

      const exUser_email = await User.findOne({where: {email}});
      if (exUser_email) {
        return res.status(400).json({
          message: '이미 가입 된 이메일 입니다.'
        });
      }

      const hash = await bcrypt.hash(password,12);
      const user = await User.create({
        userName,
        password: hash,
        email,
        nickName,
      });

      const token = signJWT(user);
      res.cookie('haveCookie', token, {
        httpOnly: true,
        // secure:true
        //sameSite: true,
      });
      return res.status(200).json({
        message: '회원가입 성공'
      });

    } catch (error) {
      console.error(error);
      return next(error);
    }
  },

  login: async (req, res, next) => {
    const {userName, password} = req.body;
    try {
      const exUser = await User.findOne({where: {userName}});
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {
          const token = signJWT(exUser);

          res.cookie('haveCookie', token, {
            httpOnly: true,
            // secure: true,
            //sameSite: true,
          });
          return res.status(200).json({
            message: '로그인 성공'
          });
        } else {
          res.status(400).json({
            message: '비밀번호가 일치하지 않습니다.'
          })
        }
      } else {
        res.status(400).json({
          message: '가입되지 않은 회원입니다.'
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      res.clearCookie('haveCookie');
      return res.status(200).json({
        message: '로그아웃 되었습니다.'
      })
    } catch(error) {
      console.error(error);
      return next(error)
    }
  },

  check: async (req, res, next) => {
    try {
      const dolls = await Doll.findAll({
        attributes: [ 'id', 'dollName'],
        where: { userId: req.user.id },
        include: [{
          model: Doll_icon,
          as: 'doll_icon',
        }],
      });

      res.status(200).json({
        user: {
          userName: req.user.userName,
          nickName: req.user.nickName,
          dolls: dolls,
        },
      })
    } catch (error) {
      console.error(error);
      return next(error)
    }
  },

};