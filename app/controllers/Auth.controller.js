 
const db=require('../models')
const User=db.user;
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

exports.register=async(req,res)=>
{
    try
    {
        const{UserName,Email,Password}=req.body;
        if(!UserName || !Email || !Password)
        {
            return res.status(400).json({success:false,message:"required fields"});
        }
        // email verification is ther or not 
        const existing =await User.findOne({where:{Email}});
        if(existing)
        {
            return res.status(409).json({success:false,message:"email already register"});
        }
        // password hashing use method
        const hashedPassword=await bcrypt.hash(Password,10);
        // newuser data detail sending
        const newUser=await User.create(
            {
                UserName,
                Email,
                Password:hashedPassword,
            }
        );
        // asign value to newUser by using User details
        return res.status(201).json({success:true,message: "user registration completed",
            data:{
                UserID:newUser.UserID,
                UserName:newUser.UserName,
                Email:newUser.Email,
               
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
            if(!Email || !Password)
            {
                return res.status(400).json({success:false,message:"field required"});
            }
            const user=await User.findOne({where:{Email}})
            if(!user)
            {
                return res.status(401).json({success:false,message:"invalid credentials"});
            }

            const isMatch =await bcrypt.compare(Password,user.Password);
            if(!isMatch)
            {
                return res.status(401).json({success:false,message:"invalid credentials"});
            }

            const token=jwt.sign(
                {
                    UserID:user.UserID,
                    Email:user.Email
                },
                process.env.JWT_SECRET,
                {expiresIn:"48h"}
            );
            return res.status(200).json({success:true,message:"login successfully",token,
                data:{
                    UserID:user.UserID,
                    UserName:user.UserName,
                    Email:user.Email,
                },
            });


        }
        catch(e)
        {
            return res.status(500).json({success:false,message:e.message});
        }
    };






 