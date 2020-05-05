module.exports=(sequelize, DataTypes)=>{
    return sequelize.define('doll',{
        serialNumber:{
            type:DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        dollName:{
            type:DataTypes.STRING(255),
            allowNull: true,
        },
        domain:{
            type:DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        is_activated:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    })
};