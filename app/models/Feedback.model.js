const {Model,DataTypes}=require('sequelize');
module.exports=(sequelize)=>
{
    class Feedback extends Model{}
    Feedback.init(
        {
            FeedbackID:
            {
                type:DataTypes.INTEGER,
                allowNull:false,
                primaryKey:true,
                autoIncrement:true,
            },
            DoctorID:
            {
                type:DataTypes.INTEGER,
                references:
                {
                    model:"Doctor",
                    key:"DoctorID",
                },
            },

            CustomerName:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Message:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Rating:
            {
                type:DataTypes.INTEGER,
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
            modelName:"Feedback",
            tableName:" Feedback",
            timestamps:false,
        },
    );
    return  Feedback;
};