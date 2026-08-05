const {Model,DataTypes}=require('sequelize')

module.exports=(sequelize)=>
{
    class Product extends Model{}
    Product.init(
        {
            ProductID :
            {
                type:DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false,
            },
            ProductName:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Category:
            {
                type:DataTypes.STRING,
                allowNull:false,
            },
            Price:
            {
                type:DataTypes.DECIMAL,
                allowNull:false,
            },
            Stock:
            {
                type:DataTypes.INTEGER,
                defaultValue:0,
                allowNull:false
            },
            Description:
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
            modelName:"Product",
            tableName:"Product",
            timestamps:false,
        },
    );
    return Product;
}