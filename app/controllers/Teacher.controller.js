const express = require('express');
const db=require('../models');
const Teacher=db.teacher;


exports.create=async(req,res)=>
{
    try
    {
const {TeacherName,Subject,Experience,Email}=req.body;
if(!TeacherName)
{
    return res.status(400).json({success:false,message:'required field'});
}
if(!Subject)
{
    return res.status(400).json({success:false,message:"field required"});
}
if(!Experience)
{
    return res.status(400).json({success:false,message:'field required'});
}
if(!Email)
{
    return res.status(400).json({success:false,message:"field required"});
}
const details=await Teacher.create({TeacherName,Subject,Experience,Email});
return res.status(201).json({success:true,message:"created sucessfully",data:details});
    }
catch(err)
    {
      return res.status(500).json({success:false,message:err.message});
    }
};

exports.getAll=async(req,res)=>
{
    try{
        const details=await Teacher.findAll();
        return res.status(200).json({success:true,count:details.length,data:details});
    }
    catch(err)
    {
        return res.status(500).json({success:false,message:err.message});
    }
};

exports.getById=async(req,res)=>
{
    try
    {
    const details=await Teacher.findByPk(req.params.id);
    if(!details)
    {
        return res.status(404).json({success:false,message:'not found'});
    }
    return res.status(200).json({success:true,message:"details found",data:details});
}
catch(err)
{
    return res.status(500).json({success:false,message:err.message});
}
};


exports.update=async(req,res)=>
{
    try{
        const details=await Teacher.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        const updates={};
        if(req.body.TeacherName) updates.TeacherName=req.body.TeacherName;
        if(req.body.Subject) updates.Subject=req.body.Subject;
        if(req.body.Experience) updates.Experience=req.body.Experience;
        if(req.body.Email) updates.Email=req.body.Email;
        if(req.body.IsActive  !== undefined) updates.IsActive=req.body.IsActive;
                await details.update(updates);
                return res.status(200).json({success:true,message:"updated sucessfully",data:details});
    }
    catch(err)
    {
        return res.status(500).json({success:false,message:err.message});
    }
};

exports.remove=async(req,res)=>
{
try
{
    const details=await Teacher.findByPk(req.params.id);
    if(!details)
    {
        return res.status(404).json({success:false,message:"not found"});
    }
    await details.destroy();
    return res.status(200).json({success:true,message:"delected successfully"});
}
catch(err)
{
    return res.status(500).json({success:false,message:err.message});
}
};

