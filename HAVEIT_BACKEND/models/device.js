module.exports=(sequelize, DataTypes)=>{
    return sequelize.define('machine',{
        machineName:{
            type:DataTypes.STRING(255),
            allowNull: false,
        },
    })
};