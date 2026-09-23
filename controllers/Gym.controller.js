
const db=require('../models')
const Gym=db.gym;
const Trainer=db.trainer;

exports.create=async(req,res)=>
{
    try
    {
        const {MemberName,Age,MembershipType,FeeAmount,JoinDate, TrainerID}=req.body;
        if(!MemberName||!Age||!FeeAmount)
        {
            return res.status(400).json({success:false,message:"filed required"});
        }
        const details=await Gym.create({
            MemberName,Age,MembershipType,FeeAmount,JoinDate, TrainerID
        });
        return res.status(201).json({success:true,message:"creasted successfully",data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

exports.getAll = async (req, res) => {
  try {
    const { MembershipType, IsActive, order, sortBy, page, limit } = req.query;

    const where = {};
    if (MembershipType) where.MembershipType = MembershipType;
    if (IsActive !== undefined) where.IsActive = IsActive === "true";

    const options = {
      where,
      order: [[sortBy || "MemberID", order === "desc" ? "DESC" : "ASC"]],
      include:[
        {
            model: Trainer,
            as:"AssignedTrainer",
            attributes:["TrainerID","TrainerName","Email"],
        },
      ],
    };

    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      options.limit = limitNum;
      options.offset = (pageNum - 1) * limitNum;
    }

    const details = await Gym.findAll(options);
    return res.status(200).json({ success: true, message: "all data", count: details.length, data: details });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

exports.getById=async(req,res)=>
{
    try
    {
        const details=await Gym.findByPk(req.params.id,{
            include:[
                {
                    model:Trainer,
                    as:"AssignedTrainer",
                    attributes:["TrainerID","TrainerName","Email"],
                },
            ],
        });
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"})
        }
        return res.status(200).json({success:true,message:"found all data",data:details});
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
          const details=await Gym.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"})
        }
        const updates={};
        if(req.body.MemberName) updates.MemberName=req.body.MemberName;
        if(req.body.Age) updates.Age=req.body.Age;
        if(req.body.MembershipType) updates.MembershipType=req.body.MembershipType;
        if(req.body.FeeAmount) updates.FeeAmount=req.body.FeeAmount;
        if(req.body.JoinDate)  updates.JoinDate=req.body.JoinDate;
        if(req.body.TrainerID) updates.TrainerID=req.body.TrainerID;
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
           const details=await Gym.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"})
        }
        await details.destroy();
        return res.status(200).json({success:true,message:"delected success fully"});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

