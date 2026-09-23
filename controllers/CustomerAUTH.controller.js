const bcrypt=require('bcrypt');
const db=require("../models");
const jwt=require('jsonwebtoken');
const Customer=db.customer;


exports.register=async(req,res)=>
{
    try
    {
        const {CustomerName,Email,Password,PhoneNum}=req.body;
   
        if(!CustomerName ||!Email || !Password)

        {
           return  res.status(400).json({success:false,message:"field required"});
        }
        const existing=await Customer.findOne({where:{Email}});
       
        if(existing)
        {
            return res.status(409).json({success:false,message:"already register"});
        }
        const hashedPassword=await bcrypt.hash(Password,10);
   
        const NewCustomer=await Customer.create(
            {
                CustomerName,
                Email,
                Password:hashedPassword,
                PhoneNum,
            },
        );
        

        return res.status(201).json({success:true,message:"created successfully",
            data:{
                CustomerName:NewCustomer.CustomerName,
                Email:NewCustomer.Email,
                PhoneNum:NewCustomer.PhoneNum,
              
            },
        });

    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};



exports.login=async(req,res)=>
{
    try
    {
        const {Email,Password}=req.body;
        if(!Email||!Password)
        {
            return res.status(400).json({success:false,message:"field required"});
        }
        const User=await Customer.findOne({where:{Email}});
        if(!User)
        {
            return res.status(401).json({success:false,message:"invalid"});
        }
        const isMatch =await bcrypt.compare(Password,User.Password);
        if(!isMatch)
        {
            return res.status(401).json({success:false,message:"invalid"});
        }

        const token=jwt.sign(
            {
                CustomerID:User.CustomerID,
                Email:User.Email,
                PhoneNum:User.PhoneNum,
            },
            process.env.JWT_SECRET,
            {expiresIn:"48h"}
        );
        return res.status(200).json({success:true,message:"login successfully",token,
            data:{
                CustomerID:User.CustomerID,
                Email:User.Email,
                PhoneNum:User.PhoneNum,
                 CustomerName:User.CustomerName,
            }
        })
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

exports.getMyProfile = async (req, res) => {
  try {
    const details = await Customer.findByPk(req.user.CustomerID, {
      attributes: { exclude: ["Password"] },
    });
    return res.status(200).json({ success: true, data: details });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};