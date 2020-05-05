module.exports=(sequelize, DataTypes)=>{
    return sequelize.define('doll_icon',{
        icon:{
            type:DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        timestamps: false,
    })
};