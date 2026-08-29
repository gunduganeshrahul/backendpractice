 const { Model, DataTypes } = require('sequelize');
 
 module.exports = (sequelize) => {
   class VehicleMaster extends Model {}
   VehicleMaster.init(
    {
        VehicleID:
        {
            type:DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true,
        },
        VehicleNumber:
        {
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
        },
        VehicleModel:
        {
            type:DataTypes.STRING,
            allowNull:false,
        },
        VehicleType:
        {
            type:DataTypes.STRING,
            allowNull:false,
        },
        PurchaseDate:
        {
            type:DataTypes.DATE,
            allowNull:false,
        },
        Status:
        {
            type:DataTypes.STRING,
            allowNull:false,
        },
        CreatedBy:
        {
            type:DataTypes.INTEGER,
            allowNull:false,
        },
    },
    {
        sequelize,
        modelName:"VehicleMaster",
        tableName:"VehicleMaster",
        timestamps:false,
    },
   );
   return VehicleMaster;
};