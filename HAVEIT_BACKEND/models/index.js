const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Cushion = require('./cushion')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);
db.Habit = require('./habit')(sequelize, Sequelize);
db.Habit_icon = require('./habit_icon')(sequelize, Sequelize);
db.Notification = require('./notification')(sequelize, Sequelize);
db.Noti_detail = require('./noti_detail')(sequelize, Sequelize);
db.Doll = require('./doll')(sequelize, Sequelize);
db.Doll_icon = require('./doll_icon')(sequelize, Sequelize);
db.Device = require('./device')(sequelize, Sequelize);
db.Received_data = require('./received_data')(sequelize, Sequelize);

db.User.hasMany(db.Doll);
db.Doll.belongsTo(db.User);

db.User.hasMany(db.Habit);
db.Habit.belongsTo(db.User);

db.Habit.hasMany(db.Notification);
db.Notification.belongsTo(db.Habit);

db.Notification.hasMany(db.Received_data);
db.Received_data.belongsTo(db.Notification);

db.Notification.hasMany(db.Noti_detail);
db.Noti_detail.belongsTo(db.Notification);

db.Habit.hasMany(db.Noti_detail);
db.Noti_detail.belongsTo(db.Habit);

db.Habit.hasMany(db.Noti_detail);
db.Noti_detail.belongsTo(db.Habit);

db.Doll.hasMany(db.Received_data);
db.Received_data.belongsTo(db.Doll);

db.Doll_icon.hasMany(db.Doll);
db.Doll.belongsTo(db.Doll_icon);

db.Habit_icon.hasMany(db.Habit);
db.Habit.belongsTo(db.Habit_icon);

db.Doll.belongsToMany(db.Device, {through:'DollDevice'});
db.Device.belongsToMany(db.Doll, {through:'DollDevice'});

db.Doll.hasMany(db.Notification);
db.Notification.belongsTo(db.Doll);

db.Noti_detail.hasMany(db.Received_data);
db.Received_data.belongsTo(db.Noti_detail);

module.exports = db;
