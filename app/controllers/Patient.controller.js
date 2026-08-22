
const db=require('../models');
const Patient=db.patient;
const Doctor=db.doctor;

exports.create=async(req,res)=>
{
    try
    {
        const {PatientName,Age,Condition,VisitDate,DoctorID}=req.body;
        if(!PatientName||!Age)
        {
            return res.status(401).json({success:false,message:"fieldrequired"});
        }
        const details=await Patient.create(
            {
                PatientName,Age,Condition,VisitDate,DoctorID
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
        const {
            PatientName,
            Age,
            Condition,
            VisitDate,
            DoctorID,
            sortBy,
            order,
            limit,
            page
        }=req.query;
        const where={};
        if(PatientName) where.PatientName=PatientName;
        if(Age) where.Age=Age;
        if(Condition) where.Condition=Condition;
        if(VisitDate) where.VisitDate=VisitDate;
        if(DoctorID) where.DoctorID=DoctorID;

        const options={
            where,
            order: [
                [
                    sortBy || "PatientID",
                     order==="DESC"?"DESC":"ASC",
                    ],
                ],
            include:[
                {
                    model: Doctor,
                    as:"AssignedDoctor",
                    attributes:
                    {
                        exclude:["Password"],
                    },
                },
            ],
    
        };
        if(page&&limit)
        {
            const pageNum=page;
            const limitNum=limit;
            options.limit=limitNum;
            options.offset=(pageNum-1)*limitNum;
        }

        const details=await Patient.findAll(options);
        return res.status(200).json({success:true,count:details.length,data:details});
    }

    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

exports.getByID=async(req,res)=>
{
    try
    {
        const details=await Patient.findByPk(req.params.id,
            {
                include:[
                    {
                        model:Doctor,
                        as:"AssignedDoctor",
                        attributes:
                        [
                            "DoctorID",
                            "DoctorName",
                            "Email"
                        ],  
                    },
                ],
            },
        );
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        return res.status(200).json({success:true,message:"all data",data:details});
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
        const details=await Patient.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        const updates={};
        if(req.body.PatientName) updates.PatientName=req.body.PatientName;
        if(req.body.Age) updates.Age=req.body.Age;
        if(req.body.Condition) updates.Condition=req.body.Condition;
        if(req.body.VisitDate) updates.VisitDate=req.body.VisitDate;
        if(req.body.DoctorID) updates.DoctorID=req.body.DoctorID;
        if(req.body.IsActive !==undefined) updates.IsActive=req.body.IsActive;
        await details.update(updates);
        return res.status(200).json({success:true,message:"updated succesfully",data:details});
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
        const details=await Patient.findByPk(req.params.id);
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