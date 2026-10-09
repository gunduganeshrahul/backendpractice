const db=require('../models')
const Department=db.department;
const Designation=db.designation;
const Candidate=db.candidate;
const { Op }=require('sequelize');

exports.createDepartment=async(req,res)=>
{
    try
    {
          const {DepartmentName,DepartmentCode}=req.body;
          if(!DepartmentName||!DepartmentCode)
          {
            return res.status(400).json({success:false,message:"DepartmentName,DepartmentCode field required"});
          }
        const details=await Department.create(
            {
                DepartmentName,
                DepartmentCode,
            },
        );
        return res.status(201).json({success:true,message:"Created successfully",data:details});
    }
    catch(e)
    {
       return res.status(500).json({success:false,message:e.message});
    }
};



exports.getAllDepartments=async(req,res)=>
{
    try
    {
         const details=await Department.findAll();
         if(details.length===0)
         {
            return res.status(400).json({success:false,message:"No departments found"});
         }
         return res.status(200).json({success:true,count:details.length,data:details});
    }
    catch(e)
    {
       return res.status(500).json({success:false,message:e.message});
    }
};


exports.getDepartmentById=async(req,res)=>
{
    try
    {

        const details=await Department.findByPk(req.params.id,
            {
                include:[
                    {
                        model:Designation,
                        attributes:[
                           "DesignationName",
                            "DesignationCode",
                        ],
                        include:[
                            {
                                model:Candidate,
                                attributes:[
                                    "CandidateName",
                                    "Email",
                                    "Phone"
                                ],
                            }
                        ]
                    }
                ]
            }
        );
        if(!details)
        {
            return res.status(404).json({success:false,message:"details not found"});
        }
        return res.status(200).json({success:true,message:"data found",data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};



exports.createDesignation=async(req,res)=>
{
    try
    {
        const {DesignationName,DesignationCode,DepartmentID}=req.body;
        if(!DesignationName||!DesignationCode||!DepartmentID)
        {
            return res.status(400).json({success:false,message:"DesignationName,DesignationCode,DepartmentID is required"})
        }
        const department=await Department.findByPk(DepartmentID);
        if(!department)
        {
            return res.status(404).json({success:false,message:"Department not found"});
        }
        const details=await Designation.create(
            {
                DesignationName,DesignationCode,DepartmentID 
            }
        );
        return res.status(201).json({success:true,message:"Created successfully",data:details});

    }
    catch(e)
    {
         return res.status(500).json({success:false,message:e.message});
    }
};


exports.getAllDesignations=async(req,res)=>
{
    try
    {
        const details=await Designation.findAll();
        if(details.length===0)
        {
            return res.status(400).json({success:false,message:"No date present"});
        }
        return res.status(200).json({success:true,count:details.length,data:details});
    }
    catch(e)
    {
         return res.status(500).json({success:false,message:e.message});
    }
};


exports.getDesignationById=async(req,res)=>
{
    try
    {
        const details=await Designation.findByPk(req.params.id,
            {
                include:[
                    {
                        model: Department,
                        attributes:
                        [
                            'DepartmentName',
                            'DepartmentCode'
                        ],
                      include:[
                        {
                            model:Candidate,
                            attributes:[
                                "CandidateName",
                                "Email",
                                "Phone",
                                "Salary",
                            ],
                        }
                      ]
                    }
                ]
            }
        );
            
        if(!details)
        {
            return res.status(404).json({success:false,message:" Designation not found"});
        };
        return res.status(200).json({success:true,message:"Designation data found",data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

exports.getDesignationByDepartment=async(req,res)=>
{
    try
    {
        const {DepartmentID}=req.params;
        const details=await Designation.findAll(
            {
                where:{
                    DepartmentID:DepartmentID,
                },
            },
        );
        if(details.length===0)
        {
            return res.status(400).json({success:false,message:"department not found"});
        }
        return res.status(200).json({success:true,count:details.length,data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


exports.createCandidate=async(req,res)=>
{
    try
    {
        const {CandidateName,Email,Phone,Salary,DesignationID}=req.body;
        if(!CandidateName||!Email||!Phone||!Salary||!DesignationID)
        {
            return res.status(400).json({success:false,message:"CandidateName,Email,Phone,Salary,DesignationID firld required"});
        }

        const details=await Designation.findByPk(DesignationID);
        if(!details)
        {
            return res.status(404).json({success:false,message:"Data not found"});
        }
        const detail=await Candidate.create(
            {
                CandidateName,
                Email,
                Phone,
                Salary,
                DesignationID,
            },
        );
        return res.status(201).json({success:true,message:"created successfully",data:detail});
    }
    catch(e)
    {
             return res.status(500).json({success:false,message:e.message});
    }
};


exports.getAllCandidates=async(req,res)=>
{
    try
    {
        const {CandidateName,Email,sortBy,order,limit,page,minSalary,maxSalary,IsActive}=req.query;
        const where={};
       
        if(CandidateName)  where.CandidateName=  {[Op.like]:`%${CandidateName}%`}
        if(Email) where.Email=  {[Op.like]:`%${Email}%`}
        if(minSalary ||maxSalary)
        {
            where.Salary={};
            if(minSalary)
            {
                where.Salary[Op.gte]=Number(minSalary);
            }
            if(maxSalary)
            {
                where.Salary[Op.lte]=Number(maxSalary);
            }
        }
        if(IsActive !==undefined)  where.IsActive=IsActive==="true"
        

        const option={
            where,
              order:[
            [
                sortBy||"DesignationID",order==="desc"?"DESC":"ASC"
            ],
        ],
        include:[
            {
                model:Designation,
                attributes:[
                    "DesignationName",
                    "DesignationCode",
                ],
        include:[
            {
                 model:Department,
                attributes:[
                    "DepartmentName",
                    "DepartmentCode",
                ],
                    },
                ]
               
            }
        ]
        
        };
        if(page && limit)
        {
            const pageNum=parseInt(page);
            const limitnum=parseInt(limit);
            option.limit=limitnum;
            option.offset=(pageNum-1)*limitnum;
        }
      
       

        const details=await Candidate.findAll(option)
        if(details.length===0)
        {
            return res.status(404).json({success:false,message:"Candidate not found"});
        }
        return res.status(200).json({success:true,message:"Candidate found",data:details});
    }
    catch(e)
    {
         return res.status(500).json({success:false,message:e.message});
    }
};

exports.getCandidateById=async(req,res)=>
{
    try
    {
        const details=await Candidate.findByPk(req.params.id,
            {
                include:[
                    {
                        model:Designation,
                        attributes:[
                            "DesignationName",
                            "DesignationCode",
                        ],
                        include:
                        [
                            {
                                model:Department,
                                attributes:
                                [
                                    "DepartmentName",
                                    "DepartmentCode",
                                ],
                            },
                        ],
                    },
                ],
            },
        );
        if(!details)
        {
            return res.status(404).json({success:false,message:"Candidate not found"});
        }
        return res.status(200).json({success:true,message:"Candidate data found",data:details});
    }
    catch(e)
    {
         return res.status(500).json({success:false,message:e.message});
    }
};

exports.updateCandidate=async(req,res)=>
{
    try
    {
        const detail=await Candidate.findByPk(req.params.id);
        if(!detail)
        {
            return res.status(404).json({success:false,message:"Candidate not found"});
        }
        
        const updates={};
        if(req.body.CandidateName) updates.CandidateName=req.body.CandidateName;
        if(req.body.Email) updates.Email=req.body.Email;
        if(req.body.Phone) updates.Phone=req.body.Phone;
        if(req.body.Salary) updates.Salary=req.body.Salary;
        if(req.body.DesignationID) updates.DesignationID=req.body.DesignationID;
         

        await detail.update(updates);

        return res.status(200).json({success:true,message:"updated successfully",data:detail});

    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});  
    }
};


exports.deleteCandidate=async(req,res)=>
{
    try
    {
        const detail=await Candidate.findByPk(req.params.id);
         if(!detail)
        {
            return res.status(404).json({success:false,message:"Candidate not found"});
        }
        await Candidate.destroy({where:
            {
                CandidateID:req.params.id
            }
        });
        return res.status(200).json({success:true,message:"delected successfully"});
    }
    catch(e)
    {
       return res.status(500).json({success:false,message:e.message});  
    }
};

exports.getCandidatesByDesignation=async(req,res)=>
{
    try
    {
        const {DesignationID}=req.params;
        const details=await Candidate.findAll(
            {
                where:
                {
                    DesignationID:DesignationID,
                },
            },
        );
        if(details.length===0)
        {
            return res.status(404).json({success:false,message:" No candidates found for this designation"});
        }
        return res.status(200).json({success:true,count:details.length,data:details});

    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};




