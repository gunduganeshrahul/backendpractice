const {Model,DataTypes}=require('sequelize')
module.exports=(sequelize)=>
{
    class Doctor extends Model{}
    Doctor.init(
        {
             DoctorID:
            {
                type:DataTypes.INTEGER,
                autoIncrement:true,
                allowNull:false,
                primaryKey:true,
            },
            DoctorName:
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
            Specialization:
            {
                type:DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName:" Doctor",
            tableName:"Doctor",
            timestamps:false,
        },
    );
    return Doctor;
};
