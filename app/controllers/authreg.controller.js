const db=require ('../models')
const User=db.reguser;
const bcrypt=require('bcrypt')

exports.register=async(req,res)=>
{
    try
    {
        const {FirstName,MiddleName,LastName,FullName,Email,Password,Collage}=req.body;
        if(!FirstName||!MiddleName||!LastName||!FullName||!Email||!Password||!Collage)
        {
            return res.status(400).json({success:false,message:"all field r required"});
        }
        const existing=await User.findOne({where:{Email}})
        if(existing)
        {
            return res.status(400).json({success:false,message:"all ready register"});
        }
        const hashedPassword=await bcrypt.hash(Password,10);
        const newUser=await User.create(
            {
                FirstName,MiddleName,LastName,FullName,Email,Collage
                ,Password:hashedPassword
            }
        );

        return res.status(201).json({success:true,message:"registration sucesfully",
            data:{
                userID:newUser.userID,
                FirstName:newUser.FirstName,
                MiddleName:newUser.MiddleName,
                LastName:newUser.LastName,
                FullName:newUser.FullName,
                Email:newUser.Email,
                Collage:newUser.Collage,
            }
        });
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};