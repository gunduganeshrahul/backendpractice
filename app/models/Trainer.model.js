 const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Trainer extends Model {}
  Trainer.init(
    {
      TrainerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      TrainerName: {
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
      Specialization: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Trainer',
      tableName: "Trainer",
      timestamps: false,
    }
  );
  return Trainer;
};