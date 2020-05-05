require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const { sequelize } = require('./models');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

const app = express();
const whitelist = ['http://ec2-52-78-69-165.ap-northeast-2.compute.amazonaws.com', 'http://haveit.coo.kr', 'http://52.78.69.165', 'http://localhost:8001', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
};
const swaggerRouter = require('./routes/swagger');
const authRouter = require('./routes/auth');
const habitRouter = require('./routes/habit');
const raspRouter = require('./routes/rasp');
const deviceRouter = require('./routes/device');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

sequelize.sync();
app.set('port', process.env.PORT || 8001);
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/swagger', swaggerRouter);
app.use('/auth', authRouter);
app.use('/habit', habitRouter);
app.use('/rasp', raspRouter);
app.use('/device', deviceRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'developement' ? err : {};
  res.status(err.status || 500).send('error');
  console.error(err.message);
});
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
