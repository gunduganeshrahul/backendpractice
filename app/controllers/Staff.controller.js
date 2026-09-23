const db=require('../models')
const Staff=db.staff;
const bcrypt=require ('bcrypt');
const jwt=require('jsonwebtoken');

exports.register=async(req,res)=>
{
    try
    {
        const {StaffName,Email,Password,Role}=req.body;
        if(!StaffName||!Email||!Password)
        {
            return res.status(400).json({success:false,message:"field required"});
        }
        const existing=await Staff.findOne({where:{Email}});
        if(existing)
        {
            return res.status(409).json({success:false,message:"already existed"});
        }
        const hashPassword=await bcrypt.hash(Password,10);
        const User=await Staff.create({
            StaffName,
            Email,
            Password:hashPassword,
            Role,
        });

        return res.status(201).json({success:true,message:"created successfully",
            data:{
                StaffID:User.StaffID,
                StaffName:User.StaffName,
                Email:User.Email,
                Role:User.Role,
            }});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


exports.Login=async(req,res)=>
{
    try
    {
        const {Email,Password}=req.body;
        if(!Email||!Password)
        {
            return res.status(400).json({success:false,message:"field required"});
        }
        const User=await Staff.findOne({where:{Email}});
        if(!User)
        {
            return res.status(401).json({success:false,message:"invalid"});
        }
        const isMatch=await bcrypt.compare(Password,User.Password);
        if(!isMatch)
        {
            return res.status(401).json({success:false,message:"invalid"});
        }
        const token=jwt.sign(
            {
                StaffID:User.StaffID,
                Email:User.Email,
            },
            process.env.JWT_SECRET,
            {expiresIn:"72h"},
        );

        return res.status(200).json({success:true,message:"login successfully",token,
            data:
            {
                StaffID:User.StaffID,
                StaffName:User.StaffName,
                Email:User.Email,
                Role:User.Role,
            }
        });
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

exports.getMyProfile=async(req,res)=>
{
    try
    {
        const details=await Staff.findByPk(req.user.StaffID,
            {
                attributes:{exclude:["Password"]},
            },
        );
      return res.status(200).json({success:true,data:details});

    }
    catch(e)
    {
         return res.status(500).json({success:false,message:e.message});
    }
};


exports.getProfileUpdate=async(req,res)=>
{
    try
    {
        const details=await Staff.findByPk(req.user.StaffID,
            {
                attributes:{exclude:["Password"]},
            },
        );
        if(!details)
        {
            return res.status(404).json({ success: false, message: "not found" });
        }
        const updates={};
        if(req.body.StaffName) updates.StaffName=req.body.StaffName;
        if(req.body.Role) updates.Role=req.body.Role;

        await details.update(updates);

        return res.status(200).json({success:true,message:"updated successfully",data:details});
    }
    catch(e)
    {
         return res.status(500).json({success:false,message:e.message});
    }
};