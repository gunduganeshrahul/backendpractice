const db=require('../models')
const Product=db.product;

exports.create=async(req,res)=>
{
    try
    {
        const {ProductName,Category,Price,Stock,Description}=req.body;
        if(!ProductName||!Category ||!Price|| !Stock)
        {
            return res.status(400).json({success:false,message:"field required"});
        }
        const details=await Product.create({ProductName,Category,Price,Stock,Description});
        return res.status(201).json({success:true,message:"Created successfully",data:details});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


 exports.getAll = async (req, res) => {
  try {
    const { ProductName, Price, Category, IsActive } = req.query;

    // Validate inputs before touching the database
    if (ProductName !== undefined && ProductName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "ProductName cannot be empty",
      });
    }

    if (Price !== undefined && (isNaN(Price) || Number(Price) <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }

    if (Category !== undefined && Category.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category cannot be empty",
      });
    }

    if (
      IsActive !== undefined &&
      IsActive !== "true" &&
      IsActive !== "false"
    ) {
      return res.status(400).json({
        success: false,
        message: "IsActive must be true or false",
      });
    }

    // Build the filter
    let where = {};
    if (ProductName) where.ProductName = ProductName;
    if (Price) where.Price = Price;
    if (Category) where.Category = Category;
    if (IsActive !== undefined) where.IsActive = IsActive === "true";

   const details = await Product.findAll({ where });

return res.status(200).json({
  success: true,
  count: details.length,
  message: details.length === 0 ? "No products matched your search." : "Products found.",
  data: details,
});
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};


exports.getById=async(req,res)=>
{
    try
    {
        const details=await Product.findByPk(req.params.id);
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
         const details=await Product.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        const updates={};
        if(req.body.ProductName) updates.ProductName=req.body.ProductName;
        if(req.body.Category) updates.Category=req.body.Category;
        if(req.body.Price) updates.Price=req.body.Price;
        if(req.body.Stock) updates.Stock=req.body.Stock;
        if(req.body.Description) updates.Description=req.body.Description;
        if(req.body.IsActive!==undefined) updates.IsActive=req.body.IsActive;
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
            const details=await Product.findByPk(req.params.id);
        if(!details)
        {
            return res.status(404).json({success:false,message:"not found"});
        }
        await details.destroy();
        return res.status(200).json({success:true,message:"deleted successfully"});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }

}