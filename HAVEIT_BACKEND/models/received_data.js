module.exports = (sequelize, DataTypes) => {
  return sequelize.define('received_data', {
    is_done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    time: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  }, {
    timestamps: true,
  })
};
