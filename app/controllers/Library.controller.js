const db=require('../models');
const Library=db.library;
exports.create=async(req,res)=>
{
    try {
        const {Title,Author,Genre,Price,Stock}=req.body;
        if(!Title || Title.trim()==="")
        {
            return res.status(400).json({success:false,message:"required field"});
        }
        if(!Author)
        {
            return res.status(400).json({success:false,message:"required field"});
        }
        if(Price===undefined)
        {
            return res.status(400).json({success:false,message:"required field"});
        }
        if(Stock===undefined)
        {
            return res.status(400).json({success:false,message:"required field"});
        }

        const details=await Library.create({Title,Author,Genre,Price,Stock});
        return res.status(201).json({success:true,message:"created successfully",data:details})

    } 
    catch (error) {
        return res.status(500).json({success:false,message:error.message});
    }
};

exports.getAll = async (req, res) => {
  try {
    const {
      Title,
      Author,
      Genre,
      Price,
      Stock,
      IsActive,
      sortBy,
      order,
      limit,
      page,
    } = req.query;

    const where = {};

    if (Title) where.Title = Title;
    if (Author) where.Author = Author;
    if (Genre) where.Genre = Genre;
    if (Price) where.Price = Price;
    if (Stock) where.Stock = Stock;
    if (IsActive !== undefined) where.IsActive = IsActive === "true";

    // Common options
    const options = {
      where,
      order: [[sortBy || "BookID", order === "desc" ? "DESC" : "ASC"]],
    };

    // Apply pagination only if page and limit are provided
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      options.limit = limitNum;
      options.offset = (pageNum - 1) * limitNum;
    }

    const details = await Library.findAll(options);

    return res.status(200).json({
      success: true,
      count: details.length,
      data: details,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 

exports.getByID=async(req,res)=>
{
    try
    {
        const details=await Library.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        return res.status(200).json({success:true,message:"get all details",data:details});
    }
    catch(error)
    {
        return res.status(500).json({success:false,message:error.message});
    }
};

exports.update=async(req,res)=>
{
    try{
        const details=await Library.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        const updates={};
        if(req.body.Title) updates.Title=req.body.Title;
        if(req.body.Author) updates.Author=req.body.Author;
        if(req.body.Genre) updates.Genre=req.body.Genre;
        if(req.body.Price !== undefined) updates.Price=req.body.Price;
        if(req.body.Stock !==undefined) updates.Stock=req.body.Stock;
        if(req.body.IsActive !== undefined) updates.IsActive=req.body.IsActive;
        await details.update(updates);
        return res.status(200).json({success:true,message:"updated successfully",data:details});

    }
    catch(error)
    {
        return res.status(500).json({success:false,message:error.message});
    }
};

exports.remove=async(req,res)=>
{
    try
    {
          const details=await Library.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        await details.destroy();
        return res.status(200).json({success:true,message:"delected successfully"});
    }
    catch(error)
    {
         return res.status(500).json({success:false,message:error.message});
    }
}