module.exports=(sequelize, DataTypes)=>{
    return sequelize.define('habit',{
        habitName:{
            type:DataTypes.STRING(255),
            allowNull: false,
        },
        is_activated:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        weekId:{
            type:DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        timestamps: true,
          paranoid: true,
    })
};