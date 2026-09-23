const db=require('../models')
const VehicleMaster=db.vehiclemaster;
const {Op}=require('sequelize');

exports.create=async(req,res)=>
{
    try
    {
        const {VehicleNumber,
                VehicleModel,
                VehicleType,
                PurchaseDate,
                Status,
                CreatedBy
            }=req.body;

            if(!VehicleNumber||!VehicleModel||!VehicleType||!PurchaseDate||!Status||!CreatedBy)
            {
                return res.status(400).json({success:false,message:"every field required"});
            }
            const existed=await VehicleMaster.findOne({where:{VehicleNumber:VehicleNumber}});  
            if(existed)
            {
                return res.status(409).json({success:false,message:" Vehicle number already exists"});
            }
            const allowStatus=[
                 "AVAILABLE",
                 "ASSIGNED",
                 "SERVICE",
                 "INACTIVE"
            ]
            if(!allowStatus.includes(Status))
            {
                return res.status(400).json({success:false,message:"invalid vehicle status"});
            }
            const allowVehicleTypes=[
                "CAR",
               "BIKE",
                "TRUCK",
                "BUS",
                "VAN"
            ]

            if(!allowVehicleTypes.includes(VehicleType))
            {
                return res.status(400).json({success:false,message:"invalid vechile type"});
            }
            
            const details=await VehicleMaster.create(
                {
                VehicleNumber,
                VehicleModel,
                VehicleType,
                PurchaseDate,
                Status,
                CreatedBy
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
        const {status,
            vehicleType,
            search,
            page=1,
            limit=10,
            sortBy,
            order,          
            }=req.query;

            const where={};

            if(status) where.Status=status;
            if(vehicleType) where.VehicleType=vehicleType;
           if(search) where[Op.or]=
           [
                {
                    VehicleNumber:
                    {
                        [Op.iLike]:`%${search}%`
                    }
                },
                {
                    VehicleModel:
                    {
                        [Op.iLike]:`%${search}%`
                    }
                },
           ];
 

           const pageNum=Number(page);
           const limitNum=Number(limit);
          if(pageNum<1||isNaN(pageNum))
           {
            return res.status(400).json({success:false,message:"invalid page"});
           }
           if(limitNum<1||limitNum>100||isNaN(limitNum))
           {
            return res.status(400).json({success:false,message:"invalid limit"});
           }
           const offset=(pageNum-1)*limitNum;


           
          
           const details=await VehicleMaster.findAndCountAll({
            
            where:where,
            limit:limitNum,
            offset:offset,

             
        });
        const totalPages = Math.ceil(details.count / limitNum);
const currentPage = pageNum;

return res.status(200).json({
    success: true,
    data: details.rows,
    pagination: {
        totalRecords: details.count,
        totalPages,
        currentPage,
        limit: limitNum
    }
});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message})
    }
};