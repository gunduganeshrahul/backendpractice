const db=require('../models');
const Supplier=db.supplier;
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const transporter=require('../config/mailer');


exports.Register=async(req,res)=>
{
    try
    {
        const {SupplierName,Email,Password, ContactNumber}=req.body;
        if(!SupplierName||!Email||!Password||!ContactNumber)
        {
            return res.status(400).json({success:false,meessage:"every field required"});
        }
        const User=await Supplier.findOne({where:{Email}});
        if(User)
        {
            return res.status(409).json({success:false,message:'email already existed'});
        }
        const hashPassword= await bcrypt.hash(Password,10);

        const newUser=await Supplier.create(
            {
                SupplierName:SupplierName,
                Email:Email,
                Password:hashPassword,
                ContactNumber:ContactNumber,
            },
        );
        return res.status(201).json({success:true,message:"register successfully",
            data:
            {
                SupplierID:newUser.SupplierID,
                SupplierName:newUser.SupplierName,
                 Email:newUser.Email,
                 ContactNumber:newUser.ContactNumber,
            },
        });
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


exports.Login=async(req,res)=>
{
    try
    {
        const {Email,Password}=req.body;

        if(!Email||!Password)
        {
            return res.status(400).json({success:false,message:"Email PAssword required"});
        }
        const User=await Supplier.findOne({where:{Email}});
        if(!User)
        {
            return res.status(404).json({success:false,message:"invalid"});
        }
        const Ismatch=await bcrypt.compare(Password,User.Password);
        if(!Ismatch)
        {
            return res.status(404).json({success:false,message:"invalid"});
        }
        const token=jwt.sign(
            {
                SupplierID:User.SupplierID,
                Email:User.Email,
            },
            process.env.JWT_SECRET,
            {expiresIn:"24h"},
        );
        return res.status(200).json({success:true,meessage:"login successfully",token,
            data:
            {
                SupplierID:User.SupplierID,
                SupplierName:User.SupplierName,
                 Email:User.Email,
                 ContactNumber:User.ContactNumber,
            }
        });
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


exports.ForgotPassword=async(req,res)=>
{
    try
    {
        const {Email}=req.body;
        if(!Email)
        {
            return res.status(400).json({success:false,message:"Email is required"});
        }
        const User=await Supplier.findOne({where:{Email}});
        if(!User)
        {
            return res.status(400).json({success:false,message:"invalid email"});
        }
        const ResetToken=crypto.randomBytes(32).toString('hex');
        const ResetTokenExpired=new Date(Date.now()+5*60*1000);

        User.Reset_Token=ResetToken;
        User.Reset_Token_Expiry=ResetTokenExpired,
        await User.save();

        const resetlink=`${process.env.CLIENT_URL}/reset-paswword/${ResetToken}`;

        console.log(resetlink,"reset link");

        await transporter.sendMail(
            {
                from:process.env.EMAIL_FROM,
                to:User.Email,
                subject:"Spplier reset-link",
                html:
                `
                <p>Hello ${User.SupplierName},</p>
                <p>You requested a password reset. Click the link below to reset it. This link expires in 5 minutes.</p>
                <p><a href="${resetlink}">${resetlink}</a></p>
                <p>If you did not request this, you can safely ignore this email.
                `
            }
        );
        return res.status(200).json({success:true,message:"Email existed.reset link share to register email"});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};

exports.ResetPassword=async(req,res)=>
{
    try
    {
        const {Password}=req.body;
        const {token}=req.params;
        
        if(!Password)
        {
            return res.status(400).json({success:false,message:"Password required"});
        }
        if(Password.length<8)
        {
            return res.status(400).json({success:false,message:"password need atleast 8 char "});
        }

        const User=await Supplier.findOne({where:{Reset_Token:token}});

        if(!User)
        {
            return res.status(400).json({success:false,message:"Invalid or expired Token"});
        }

        if(!User.Reset_Token_Expiry||new Date()>new Date (User.Reset_Token_Expiry))
        {
            return res.status(400).json({success:false,message:"token expired pls request a new one"});
        }

        const hashPassword=await bcrypt.hash(Password,10);

         User.Password=hashPassword,
         User.Reset_Token=null,
         User.Reset_Token_Expiry=null,
         await User.save();

         return res.status(200).json({success:true,message:"password reset successfully"});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
}; 