const { where } = require('sequelize');
const db=require('../models');
const Invoice=db.invoice;
const Library=db.library;

exports.create=async(req,res)=>
{
    try
    {
        const {InvoiceNumber,CustomerName,Amount,BookID}=req.body;

        if(!InvoiceNumber||!CustomerName||!Amount)
        {
            return res.status(400).json({success:false,message:"field required"});
        }
        const existedInvoice= await Invoice.findOne({where:
            {
                InvoiceNumber:req.body.InvoiceNumber
            }
        });
         if(existedInvoice)
        {
            return res.status(409).json({success:false,message:"InvoiceNumber already existed "});
        }
        const details=await Invoice.create({InvoiceNumber,CustomerName,Amount,BookID});
        return res.status(201).json({success:true,message:"created success fully",data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:"false",message:e.message});
    }
};


 exports.getAll = async (req, res) => {
  try {
    const {
      InvoiceNumber,
      CustomerName,
      Amount,
      Status,
      DueDate,
      IsActive,
      sortBy,
      order,
      limit,
      page,
    } = req.query;

    const where = {};

    if (InvoiceNumber) where.InvoiceNumber = InvoiceNumber;
    if (CustomerName) where.CustomerName = CustomerName;
    if (Amount) where.Amount = Amount;
    if (Status) where.Status = Status;
    if (DueDate) where.DueDate = DueDate;

    if (IsActive !== undefined) {
      where.IsActive = IsActive === "true";
    }

    const options = {
      where,

      order: [
        [
          sortBy || "InvoiceID",
          order === "desc" ? "DESC" : "ASC",
        ],
      ],

      include: [
        {
          model: Library,
          as: "AssignedBook",
        },
      ],
    };

    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      options.limit = limitNum;
      options.offset = (pageNum - 1) * limitNum;
    }

    const details = await Invoice.findAll(options);

    return res.status(200).json({
      success: true,
      count: details.length,
      data: details,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

 exports.getById = async (req, res) => {
  try {
    const details = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: Library,
          as: "AssignedBook",
        },
      ],
    });

    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Details found",
      data: details,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.update=async(req,res)=>
{
    try
    {
        const details=await Invoice.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        const updates={};
        if(req.body.CustomerName) updates.CustomerName=req.body.CustomerName;
        if(req.body.Amount) updates.Amount=req.body.Amount;
        if(req.body.Status) updates.Status=req.body.Status;
        if(req.body.DueDate) updates.DueDate=req.body.DueDate;
        if(req.body.IsActive !==undefined) updates.IsActive=req.body.IsActive;
        if(req.body.BookID !==undefined) updates.BookID=req.body.BookID;

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
        const details=await Invoice.findByPk(req.params.id)
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
