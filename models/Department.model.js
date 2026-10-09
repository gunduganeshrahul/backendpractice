const {Model,DataTypes}=require('sequelize');
module.exports=(sequelize)=>
{
    class Department extends Model{};
    Department.init(
        {
            DepartmentID:
            {
                type:DataTypes.INTEGER,
                allowNull:false,
                autoIncrement:true,
                primaryKey:true,
            },
            DepartmentName:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            DepartmentCode:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            IsActive:
            {
                type:DataTypes.BOOLEAN,
                defaultValue:true,
            },
        },
        {
            sequelize,
            modelName:"Department",
            tableName:"Department",
            timestamps:false,
        },
    );
    return Department;
};