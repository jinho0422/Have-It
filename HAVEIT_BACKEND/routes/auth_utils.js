const { User } = require('../models');
const jwt = require('jsonwebtoken');


exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies['haveCookie']) {
      const token = jwt.verify(req.cookies['haveCookie'], process.env.JWT_SECRET);
      const exUser = await User.findByPk(token.id);

      if (exUser) {
        req.user = token;
        if (Date.now().valueOf() / 1000 + 60*60*2 > token.exp) {
          const token = jwt.sign({
            id: exUser.id,
            userName: exUser.userName,
          }, process.env.JWT_SECRET, {
            expiresIn: '3d',
            issuer: 'HAVEIT'
          });
          res.cookie('haveCookie', token, {
            httpOnly: true,
            // secure:true,
            //sameSite: true,
          });
        }
        next()
      } else {
        return res.status(403).json({
          message: '유효하지 않은 요청입니다.'
        })
      }
    } else {
      console.error('**************** 토큰이 없습니다 ****************');
      res.clearCookie('haveCookie');
      res.status(403).json({
        message: '다시 로그인 해주세요.'
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};


exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user.is_staff) {
      next();
    } else {
      return res.status(403).json({
        message: '권한이 없습니다.'
      })
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};


exports.isNotLoggedIn = (req, res, next) => {
  try {
    if (!req.cookies['haveCookie']) {
      next();
    } else {
      res.clearCookie('haveCookie');
      next();
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};


exports.signJWT = (user) => {
  return jwt.sign({
    id: user.id,
    userName: user.userName,
  }, process.env.JWT_SECRET, {
    expiresIn: '3d',
    issuer: 'HAVEIT'
  })
};
