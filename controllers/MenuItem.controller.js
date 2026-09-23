const { where, Model } = require('sequelize');
const db=require('../models');
const Restaurant=db.restaurant;
const Chef=db.chef;

exports.create = async (req, res) => {
    try {

        const {
            ItemName,
            Price,
            Category,
            IsAvailable,
            ChefID
        } = req.body;

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        // Get uploaded image filename
        const Image = req.file ? req.file.filename : null;

        if (!ItemName || !Price) {
            return res.status(400).json({
                success: false,
                message: "ItemName and Price are required"
            });
        }

        const details = await Restaurant.create({
            ItemName,
            Price,
            Category,
            IsAvailable,
            ChefID,
            Image
        });

        return res.status(201).json({
            success: true,
            message: "Created successfully",
            data: details
        });

    } catch (e) {

        console.log(e);

        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

exports.getAll=async(req,res)=>
{
    try
    {
        const {Category,IsAvailable,ChefID,sortBy,order,limit,page}=req.query;
        const whare={};
        if(Category) where.Category=Category;
        if(IsAvailable) where.IsAvailable=Category;
        if(ChefID) where.ChefID=ChefID;


        const option=
        {
            whare,
            order:[
                [
                    sortBy||"MenuItemID",
                    order==="DESE"?"DESE":"ASC"
                ],
            ],
            include:[
                {
                    model:Chef,
                    attributes:
                   {
                    exclude:["Password","Reset_Token","Reset_Token_Expiry"],

                   }
                }
            ]
            
        };
        const details=await Restaurant.findAll(option);
        return res.status(200).json({success:true,count:details.length,data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

exports.getById=async(req,res)=>
{
    try
    {
        const details=await Restaurant.findByPk(req.params.id,
            {
                include:[
                    {
                        model:Chef,
                        attributes:
                        {
                            exclude:["Password"],
                        },
                        
                    },
                ],
            },
           
        );
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        return res.status(200).json({success:false,message:"details found",data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

exports.update=async(req,res)=>
{
    try
    {
        const details=await Restaurant.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        const updates={};
        if( req.body.ItemName) updates.ItemName=req.body.ItemName;
        if(req.body.Price)updates.Price=req.body.Price;
        if(req.body.Category) updates.Category=req.body.Category;
        if(req.body.IsAvailable !==undefined) updates.IsAvailable=req.body.IsAvailable;
        if(req.body.ChefID) updates.ChefID=req.body.ChefID;
        
        await details.update(updates);

        return res.status(200).json({success:true,message:"updated successfully",data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


exports.remove=async(req,res)=>
{
    try
    {
        const details=await Restaurant.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        await details.destroy();

        return res.status(200).json({success:true,message:"successfully deleted"});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};
