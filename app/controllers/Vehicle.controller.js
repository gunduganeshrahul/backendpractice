 const { parse } = require('dotenv');
const db=require ('../models')
 const Vehicle=db.vehicle;
 
 exports.create=async(req,res)=>
 {
    try
    {
        const {VehicleName,Model,RegistrationNumber,FuelType,Price}=req.body;

        if(!VehicleName || !Model || !RegistrationNumber ||!FuelType || !Price)
        {
            return res.status(400).json({success:false,message:"field required"});
        }

        const details=await Vehicle.create({VehicleName,Model,RegistrationNumber,FuelType,Price});
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
        const {VehicleName,Model,RegistrationNumber,FuelType,Price,IsActive,order,sortBy,page,limit}=req.query;
        const where={};
        if(VehicleName) where.VehicleName=VehicleName;
        if(Model) where.Model=Model;
        if(RegistrationNumber) where.RegistrationNumber=RegistrationNumber;
        if(FuelType) where.FuelType=FuelType;
        if(Price) where.Price=Price;
        if(IsActive !== undefined) where.IsActive=IsActive ==="true";

        let options={
            where,
            order:[[sortBy||"VehicleID" , order==="desc"?"DESC":"ASC"]],
        };
        if(page && limit)
        {
           const pageNum=parseInt(page);
           const limitNum=parseInt(limit);
           options.limit=limitNum;
           options.offset=(pageNum-1)*limitNum;
       }
        const details=await Vehicle.findAll(options);

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
        const details=await Vehicle.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        return res.status(200).json({success:true,message:"data found",data:details});
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
       const details=await Vehicle.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
      
        const updates={};
        if(req.body.VehicleName) updates.VehicleName=req.body.VehicleName;
        if(req.body.Model) updates.Model=req.body.Model;
        if(req.body.RegistrationNumber) updates.RegistrationNumber=req.body.RegistrationNumber;
        if(req.body.FuelType) updates.FuelType=req.body.FuelType;
        if(req.body.Price) updates.Price=req.body.Price;
        if(req.body.IsActive ==!undefined) updates.IsActive=req.body.IsActive;
        await details.update(updates);
        return res.status(200).json({success:true,message:"updated success fully",data:details});
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
        const details=await Vehicle.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }

        await details.destroy();
        return res.status(200).json({success:true,message:"delected successfully"});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};