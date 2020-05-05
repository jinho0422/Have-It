module.exports=(sequelize, DataTypes)=>{
    return sequelize.define('noti_detail',{
      weekId:{
        type:DataTypes.INTEGER,
        allowNull: false,
      },
      time:{
        type:DataTypes.STRING(10),
        allowNull: false,
      },
      endTime:{
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      repeat:{
        type:DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cnt: {
        type:DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      habitName: {
        type:DataTypes.STRING(255),
        allowNull: false,
      },
    }, {
      timestamps: false,
    })
  };