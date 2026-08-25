const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {

  class Register extends Model {}

  Register.init(

    {
      UserID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      UserName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      sequelize,
      modelName: "Register",
      tableName: "RegisterFE",
      timestamps: false,
    }

  );

  return Register;
};