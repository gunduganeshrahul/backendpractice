const { where } = require('sequelize');
const db=require('../models')
const Vendor=db.vendor;
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

exports.register=async(req,res)=>
{
    try
    {
        const {VendorName,Email,Password,CompanyName}=req.body;
        if(!VendorName||!Email||!Password)
        {
            return res.status(400).json({success:false,message:"field required"});
        }
        const existing=await Vendor.findOne({where:{Email}});
        if(existing)
        {
            return res.status(409).json({success:false,message:"Email alreaady existed"});
        }
        const hashpassword=await bcrypt.hash(Password,10);
        const newVendor=await Vendor.create(
            {
                VendorName,
                Email,
                CompanyName,
                Password:hashpassword,
            },
        );
        return res.status(201).json({success:true,message:"created successfully",
            data:
            {
                VendorID:newVendor.VendorID,
                VendorName:newVendor.VendorName,
                Email:newVendor.Email,
                CompanyName:newVendor.CompanyName,
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
        const User=await Vendor.findOne({where:{Email}});
        if(!User)
        {
            return res.status(401).json({success:false,message:"invalid"});
       }
       const IsMatch=await bcrypt.compare(Password,User.Password);
       if(!IsMatch)
       {
        return res.status(401).json({success:false,message:"invalid"});
       }
       const token=jwt.sign(
        {
            VendorID:User.VendorID,
            Email:User.Email,
        },
        process.env.JWT_SECRET,
        {expiresIn:"48h"},
       );
       return res.status(200).json({success:true,message:"login successfully",token,
        data:
        {
            VendorID:User.VendorID,
            VendorName:User.VendorName,
            Email:User.Email,
            CompanyName:User.CompanyName,
        },
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
        const details=await Vendor.findByPk(req.user.VendorID,
            {
                attributes:{exclude:["Password"]},
            }
        );
        return res.status(200).json({success:true,data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

exports.updateProfile=async(req,res)=>
{
    try
    {
        const details=await Vendor.findByPk(req.user.VendorID,
            {
                attributes:{exclude:["Password"]},
            }
        );
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        const updates={};
        if(req.body.VendorName) updates.VendorName=req.body.VendorName;
        if(req.body.CompanyName) updates.CompanyName=req.body.CompanyName;
        await details.update(updates);
        return res.status(200).json({success:true,message:"updated successfully",data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


