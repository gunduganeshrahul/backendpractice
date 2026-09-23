 const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {

    class Restaurant extends Model {}

    Restaurant.init(
        {
            MenuItemID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            ChefID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Chef",
                    key: "ChefID",
                },
            },

            ItemName: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            Price: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },

            Category: {
                type: DataTypes.STRING,
            },

            IsAvailable: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },

            Image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Restaurant",
            tableName: "Restaurant",
            timestamps: false,
        }
    );

    return Restaurant;
};