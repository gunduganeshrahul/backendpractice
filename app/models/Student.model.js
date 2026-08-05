 const {Model,DataTypes}=require ('sequelize');
 module.exports=(sequelize)=>
 {
    class StudentInformation extends Model{}
    StudentInformation.init(
        {
            StudentInfoID:
            {
                type:DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true,
                allowNull:false,
            },
            Name:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Branch:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Department:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            College:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Skill:
            {
                type:DataTypes.STRING,
               
            },
            IDNo:
            {
                type:DataTypes.INTEGER,
                allowNull:false,
            },
            CGPA:
            {
                type:DataTypes.DECIMAL,
                allowNull:false,
            },
            
        },
        {
            sequelize,
            modelName:'StudentInformation',
            tableName:'StudentInformation',
            timestamps:false,
        },
        
    );
    return StudentInformation;
 }