const db=require('../models');
const Feedback=db.feedback;
const Doctor=db.doctor;
const Patient=db.patient;

exports.create=async(req,res)=>
{
    try
    {
        const {CustomerName,Message,Rating,DoctorID,PatientID}=req.body;
        if(!CustomerName|| !Message||!Rating)
        {
            return res.status(401).json({success:false,message:"field required"});
        }
        const details=await Feedback.create(
            {
                CustomerName,
                Message,
                Rating,
                DoctorID,
                PatientID
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
            Message,
            Rating,
            DoctorID,
            PatientID,
            IsActive,
            sortBy,
            order,
            limit,
            page,
        }=req.query;

    const where={};
    if(CustomerName) where.CustomerName=CustomerName;
    if(Message) where.Message=Message;
    if(Rating) where.Rating=Rating;
    if(DoctorID) where.DoctorID=DoctorID;
    if(IsActive !== undefined) where.IsActive=IsActive =="true";
    if(PatientID) where.PatientID=PatientID;

    const options={
        where,
        order:[
            [
                sortBy || "FeedbackID", order==="DESC"?"DESC":"ASC"
            ]
        ],
        include:[
            {
                model:Doctor,
                attributes:
                {
                    exclude:["Password"],
                },
            },
            {
                 model: Patient,
                
            }
        ],
    };
    if(page&&limit)
    {
        const pageNum=page;
        const limitNum=limit;
        options.limit=limitNum;
        options.offset=(pageNum-1)*limitNum;
    }

    const details=await Feedback.findAll(options);
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
        const details=await Feedback.findByPk(req.params.id,
            {
                include:[
                    {
                        model:Doctor,
                        attributes:
                        {
                            exclude:["Password"],
                        }
                    },
                    {
                        model:Patient,
                    }
                ],
            }
        );
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        return res.status(200).json({success:true,message:"details found",data:details});
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
        const details=await Feedback.findByPk(req.params.id,
            {
                include:[
                    {
                        model:Doctor,
                        attributes:
                        {
                            exclude:["Password"],
                        },
                    },
                    {
                         model:Patient,
                    }
                ]
            }
        );
        const updates={};
        if(req.body.CustomerName) updates.CustomerName=req.body.CustomerName;
            if(req.body.Message) updates.Message=req.body.Message;
                if(req.body.Rating) updates.Rating=req.body.Rating;
                if(req.body.DoctorID) updates.DoctorID=req.body.DoctorID;
                if(req.body.PatientID) updates.PatientID=req.body.PatientID;
                if(req.body.IsActive !== undefined)updates.IsActive=req.body.IsActive;

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
        const details=await Feedback.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        await details.destroy();
        return res.status(200).json({success:true,data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};