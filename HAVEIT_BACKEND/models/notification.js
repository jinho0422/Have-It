module.exports=(sequelize, DataTypes)=>{
    return sequelize.define('notification',{
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
    }, {
        timestamps: true,
        paranoid: true,
    })
};