const db=require('../models/');
const Course=db.course;

exports.create=async(req,res)=>
{
    
    try
    {
const{CourseName,Duration,Fee,Instructor}=req.body;
console.log(req.body,"............1");
if(!CourseName)
{
    return res.status(400).json({success:false,message:"required field"});
}
if(!Duration)
{
    return res.status(400).json({success:false,message:"required field"});
}
if(!Fee)
{
    return res.status(400).json({success:false,message:"required field"});
}

const details=await Course.create({CourseName,Duration,Fee,Instructor});
console.log(details,".................2");
return res.status(201).json({success:true,message:"created successfully",data:details});

}
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

exports.getAll=async(req,res)=>
{
    try{
        const {CourseName,Duration,Fee,Instructor,IsActive}=req.query;
        if(CourseName !== undefined && CourseName.trim()==='')
        {
            return res.status(400).json({success:false,message:"coursename required"});
        }
       if (Duration !== undefined && (isNaN(Duration) || Number(Duration) <= 0)) {
  return res.status(400).json({ success: false, message: "Duration must be a valid positive number" });
}
        if(Fee !== undefined &&(isNaN(Fee) || Number(Fee)<=0))
        {
            return res.status(400).json({
        success: false,
        message: "fee must be a valid positive number",
      });
        }
        if(Instructor!==undefined && Instructor.trim()==="")
        {
            return res.status(400).json({success:false,message:"Instructor required"});
        }
       if (IsActive !== undefined && IsActive !== "true" && IsActive !== "false") {
  return res.status(400).json({ success: false, message: "IsActive must be true or false" });
}
    

      let where={};
      if(CourseName) where.CourseName=CourseName;
      if(Duration) where.Duration=Duration;
      if(Fee)where.Fee=Fee;
      if(Instructor) where.Instructor=Instructor;
      if(IsActive !== undefined) where.IsActive=IsActive==="true";
      const details=await Course.findAll({where,order:[[sortBy || "CourseId",order==='desc'?"desc":"asc"]]});

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
const details=await Course.findByPk(req.params.id);
if(!details)
{
    return res.status(404).json({success:false,message:"not found"});
}
return  res.status(200).json({success:true,message:"detail found",data:details});
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
        const details=await Course.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"}); 
        }

        const updates={};
        if(req.body.CourseName) updates.CourseName=req.body.CourseName;
        if(req.body.Duration) updates.Duration=req.body.Duration;
        if(req.body.Fee) updates.Fee=req.body.Fee;
        if(req.body.Instructor) updates.Instructor=req.body.Instructor;
        if(req.body.IsActive !== undefined) updates.IsActive=req.body.IsActive;

        await details.update(updates);
        return res.status(200).json({success:true,message:"updated sucessfully",data:details});
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
         const details=await Course.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"}); 
        }
        await details.destroy();
         return res.status(200).json({success:true,message:"deleted sucessfully"}); 
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
}