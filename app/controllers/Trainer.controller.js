const { where } = require('sequelize');
const db=require('../models')
const Trainer=db.trainer
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

exports.register=async(req,res)=>
{
    try
    {
        const {TrainerName,Email,Password,Specialization}=req.body;
        if(!TrainerName || !Email || !Password)
        {
            return res.status(400).json({success:false,message:"field required"});
        }
        const existed =await Trainer.findOne({where:{Email}})
        if(existed)
        {
            return res.status(409).json({success:false,message:'already exsisted'}) ;
        }
            const hashedPassword=await bcrypt.hash(Password,10);
            const newUser=await Trainer.create(
                {
                    TrainerName,
                    Email,
                    Password:hashedPassword,
                    Specialization
                }
            );
            return  res.status(201).json({success:true,message:"register successfully",
                data:
                {
                   TrainerID:newUser.TrainerID,
                   TrainerName:newUser.TrainerName,
                   Email:newUser.Email,
                   Specialization:newUser.Specialization,
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
        if(!Email|| !Password)
        {
            return res.status(400).json({success:false,message:"field required"});
        }
        const verification=await Trainer.findOne({where:{Email}})
        if(!verification)
        {
            return res.status(401).json({success:false,message:"not valid"});
        }
        const isMatch=await bcrypt.compare(Password,verification.Password);
        if(!isMatch)
        {
            return res.status(401).json({success:false,message:"invalid"});
        }
        const token=jwt.sign({
            TrainerID:verification.TrainerID,
            Email:verification.Email,
        },
        process.env.JWT_SECRET,
        {expiresIn:"78h"}
    
    );
    return res.status(200).json({success:true,message:"login successfully",token,
        data:
        {
            TrainerID:verification.TrainerID,
            TrainerName:verification.TrainerName,
            Email:verification.Email,
            Specialization:verification.Specialization,
        },
    });
    }
    catch(e)
    {
       return res.status(500).json({success:false,message:e.message});
    }
};