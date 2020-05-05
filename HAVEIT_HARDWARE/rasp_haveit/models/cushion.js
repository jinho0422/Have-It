module.exports=(sequelize, DataTypes)=>{
    return sequelize.define('cushion',{
        middle_:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        front_:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        back_:{
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        left_:{
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        right_:{
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        left_twisted_:{
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        right_twisted_:{
            type:DataTypes.INTEGER,
            allowNull: false,
        }
    });
};