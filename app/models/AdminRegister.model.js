 const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AdminReg extends Model {}
  AdminReg.init(
    {
      AdminID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      AdminName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      PhoneNum: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "AdminReg",
      tableName: "AdminReg",
      timestamps: false,
    }
  );
  return AdminReg;
};