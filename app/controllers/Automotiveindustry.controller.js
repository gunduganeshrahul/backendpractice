const db=require('../models')
const  CustomurMaster=db.customermaster;

exports.create=async(req,res)=>
{
    try
    {
        const {CustomerName,Email,PhoneNo,Age,Gender, Address,City,State,Pincode,VehicleBrand,VehicleModel,PaymentMethod}=req.body;
        if(!CustomerName||!Email||!PhoneNo||!Age||!Gender||!Address||!City||!State||!Pincode||!VehicleBrand||!VehicleModel||!PaymentMethod)
        {
            return res.status(401).json({success:false,message:"Required fields are missing"});
        }
        const details=await CustomurMaster.create(
            {
                CustomerName,Email,PhoneNo,Age,Gender, Address,City,State,Pincode,VehicleBrand,VehicleModel,PaymentMethod
            }
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
        const {CustomerName,
            Email,
            PhoneNo,
            Age,
            Gender,
             Address,
             City,
             State,
             Pincode,
             VehicleBrand,
             VehicleModel,
             PaymentMethod,
            sortBy,
            order,
            limit,
            page,
            }=req.query;

            const where={};
            if(CustomerName) where.CustomerName=CustomerName;
            if(Email) where.Email=Email;
            if(PhoneNo) where.Phone=Phone;
            if(Age) where.Age=Age;
            if(Gender) where.Gender=Gender;
            if(Address) where.Address=Address;
            if(City) where.City=City;
            if(State) where.State=State;
            if(Pincode) where.Pincode=Pincode;
            if(VehicleBrand) where.VehicleBrand=VehicleBrand;
            if(VehicleModel) where.VehicleModel=VehicleModel;
            if(PaymentMethod) where.PaymentMethod=PaymentMethod;

            const method={
                where,
                order:[[sortBy || "CustomerID",order==="DESC"?"DESC":"ASC"]],
            };
            if(page&&limit)
            {
                const pageNum=page;
                const limitNum=limit;
                method.limit=limitNum;
                method.offset=(pageNum-1)*limitNum;
            };

            const details=await CustomurMaster.findAll(method);
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
        const details=await CustomurMaster.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        return res.status(201).json({success:true,message:"data found",data:details});
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
         const details=await CustomurMaster.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        const updates={};
        if(req.body.CustomerName) updates.CustomerName=req.body.CustomerName;
        if(req.body.Email) updates.Email=req.body.Email;
        if(req.body.PhoneNo) updates.PhoneNo=req.body.PhoneNo;
        if(req.body.Age) updates.Age=req.body.Age;
        if(req.body.Gender) updates.Gender=req.body.Gender;
        if(req.body.Address)updates.Address=req.body.Address;
        if(req.body.City) updates.City=req.body.City;
        if(req.body.State) updates.State=req.body.State;
        if(req.body.Pincode) updates.Pincode=req.body.Pincode;
        if(req.body.VehicleBrand)updates.VehicleBrand=req.body.VehicleBrand;
        if(req.body.VehicleModel) updates.VehicleModel=req.body.VehicleModel;
        if(req.body.PaymentMethod) updates.PaymentMethod=req.body.PaymentMethod;

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

          const details=await CustomurMaster.findByPk(req.params.id);
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