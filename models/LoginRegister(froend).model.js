 const {Model,DataTypes}=require('sequelize')
module.exports=(sequelize)=>
{
    class LoginReg extends Model{}

    LoginReg.init(
        {
            LoginRegID:
            {
                type:DataTypes.INTEGER,
                allowNull:false,
                primaryKey:true,
                autoIncrement:true,
            },
            UserName:
            {
                type:DataTypes.STRING,
                allowNull:false
            },
            Email:
            {
                type:DataTypes.STRING,
                allowNull:false,             
            },
            PhoneNo:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Address:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Gender:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Password:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
           Role:
           {
            type:DataTypes.STRING,
            allowNull:false,
           },
           IsActive:
           {
            type:DataTypes.BOOLEAN,
            defaultValue:true,
            allowNull:false,
           },
           reset_token:
           {
                type: DataTypes.STRING,
                allowNull: true,
           },
           reset_token_expiry:
           {
                type: DataTypes.DATE,
                allowNull: true,
           },
        },
        {
            sequelize,
            modelName:"LoginReg",
            tableName:"LoginReg",
            timestamps:false,
        },
    );
    return LoginReg;
};