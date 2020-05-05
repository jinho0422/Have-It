module.exports=(sequelize, DataTypes)=>{
    return sequelize.define('user',{
        userName: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        nickName: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        is_staff: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    }, {
        timestamps: true,
          paranoid: true,
    })
};
