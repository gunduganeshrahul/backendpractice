const {Model,DataTypes}=require('sequelize');
module.exports= (sequelize)=>
{
    class Staff extends Model{}
    Staff.init(
        {
            StaffID:
            {
                type:DataTypes.INTEGER,
                autoIncrement:true,
                allowNull:false,
                primaryKey:true,
            },
            StaffName:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Email:
            {
                type:DataTypes.STRING,
                allowNull:false,
                unique:true,
            },
            Password:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Role:
            {
                type:DataTypes.STRING,
            },
        },
            {
                sequelize,
                modelName:"Staff",
                tableName:"Staff",
                timestamps:false,
            },
    );
    return Staff;
};