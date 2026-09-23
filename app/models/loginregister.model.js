 const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class LoginReg extends Model {}
  LoginReg.init(
    {
      UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      UserName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "LoginReg",
      tableName: "LoginReg",
      timestamps: false,
    }
  );
  return LoginReg;
};