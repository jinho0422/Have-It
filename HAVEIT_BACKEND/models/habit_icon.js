module.exports=(sequelize, DataTypes)=>{
    return sequelize.define('habit_icon',{
        icon:{
            type:DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        timestamps: false,
    })
};