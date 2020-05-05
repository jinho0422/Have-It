module.exports=(sequelize, DataTypes)=>{
    return sequelize.define('notification',{
        notiId:{
            type:DataTypes.INTEGER(11),
            allowNull:false,
        },
        noti_detailId:{
            type:DataTypes.INTEGER(11),
            allowNull:false,
        },
        weekId:{
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        time:{
            type:DataTypes.STRING(10),
            allowNull: false,
        },
        habitName:{
            type:DataTypes.STRING(255),
            allowNull: false,
        },
        habitId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        is_activated:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        activate:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },{
        timestamps: false,
    })
};