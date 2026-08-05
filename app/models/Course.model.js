const {Model,DataTypes}=require('sequelize');
module.exports=(sequelize)=>
{
    class Course extends Model{}
    Course.init(
        {
            CourseID:
            {
                type:DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false,
            },
        CourseName:
        {
            type:DataTypes.STRING,
           allowNull:false,
        },
        Duration:
        {
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        Fee:
        {
            type:DataTypes.DECIMAL(10,2),
            allowNull:false,
        },
        Instructor:
        {
            type:DataTypes.STRING,
            
        },
        IsActive:
        {
            type:DataTypes.BOOLEAN,
            defaultValue:true,
        },
        },
        {
            sequelize,
            modelName:"Course",
            tableName:'Course',
            timestamps:false,
        },
    );
    return Course;
}