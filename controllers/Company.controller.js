const db=require('../models');

const Company=db.company;

exports.create=async(req,res)=>
{
    try
    {
        const { CompanyName,CompanyCode,Email,}=req.body;
        if(!CompanyName||!CompanyCode||!Email)
        {
            return res.status(400).json({success:false,message:"CompanyName,CompanyCode,Email this field required"});
        }
        const details=await Company.create(
            {
                CompanyName,CompanyCode,Email
            },
        );
        return res.status(201).json({success:true,message:"created successfully",data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


exports.getAll=async(req,res)=>
{
    try
    {
        const details=await Company.findAll();
        if(details.length===0)
        {
            return res.status(400).json({success:false,message:"details not found"});
        }

        return res.status(200).json({success:false,count:details.length,data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


exports.getbyId=async(req,res)=>
{
    try
    {
        const details=await Company.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"details not found"});
        }
        return res.status(200).json({success:true,message:"details found",data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};