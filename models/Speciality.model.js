const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {

    class Speciality extends Model {}

    Speciality.init(
        {
            SpecialityID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },

            SpecialityName: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: "Speciality",
            tableName: "Speciality",
            timestamps: false,
        }
    );

    return Speciality;
};