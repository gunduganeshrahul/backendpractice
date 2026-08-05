const db=require('../models')
const Employee=db.employee;


exports.create=async(req,res)=>
{
try
{
    const {EmployeeName,Designation,Department,Salary,JoiningDate}=req.body;
    if( !EmployeeName || !Designation || !Department ||!Salary)
    {
        return res.status(400).json({success:false,message:"required field"});
    }
    const details=await Employee.create({EmployeeName,Designation,Department,Salary,JoiningDate});
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
        const{EmployeeName,Designation,Department,Salary,JoiningDate,IsActive,sortBy,order,page,limit}=req.query;
        const where={};
        if(EmployeeName) where.EmployeeName=EmployeeName;
        if(Designation) where.Designation=Designation;
        if(Department) where.Department=Department;
        if(Salary) where.Salary=Salary;
        if(JoiningDate) where.JoiningDate=JoiningDate;
        if(IsActive !== undefined) where.IsActive=IsActive ==="true";

        const options={
            where,
            order:[[sortBy || "EmployeeID",order==="desc"?"DESC":"ASC"]],
        };
        if(page&&limit)
        {
            const pageNum=parseInt(page);
            const limitNum=parseInt(limit);
            options.limit=limitNum;
            options.offset=(pageNum-1)*limitNum;
        }
        const details=await  Employee.findAll(options);
        return res.status(200).json({success:true,count:details.length,data:details});

    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

exports.getById=async(req,res)=>
{
    try{
        const details=await Employee.findByPk(req.params.id);
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
        const details=await Employee.findByPk(req.params.id);
        if(!details)
        {
             return res.status(404).json({success:false,message:"not found"});
        }
        const updates={};
        if(req.body.EmployeeName) updates.EmployeeName=req.body.EmployeeName;
        if(req.body.Designation) updates.Designation=req.body.Designation;
        if(req.body.Department) updates.Department=req.body.Department;
        if(req.body.Salary ) updates.Salary=req.body.Salary;
        if(req.body.JoiningDate) updates.JoiningDate=req.body.JoiningDate;
        if(req.body.IsActive!== undefined) updates.IsActive=req.body.IsActive;

        await details.update(updates);
        return res.status(200).json({success:true,message:"updated sucess fully",data:details});
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
         const details=await Employee.findByPk(req.params.id);
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
