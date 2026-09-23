const { where } = require('sequelize');
const db=require('../models');
const Chef=db.chef;
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const transporter=require('../config/mailer');

exports.register=async(req,res)=>
{
    try
    {
        const {ChefName, Email, Password,Speciality}=req.body;
        if(!ChefName||!Email||!Password||!Speciality)
        {
            return res.status(400).json({success:false,message:"ChefName, Email, Password,Speciality field required"});
        }
        const existed=await Chef.findOne({where:{Email}});
        if(existed)
        {
            return res.status(409).json({success:false,message:"already email existed"});
        }
        const hashpasssowrd=await bcrypt.hash(Password,10);

        const User=await Chef.create(
            {
                ChefName:ChefName,
                 Email:Email,
                 Password:hashpasssowrd,
                 Speciality:Speciality,
            },
        );
        return res.status(201).json({success:false,message:"register successfully",
            data:
            {
                ChefName:User.ChefName,
                Email:User.Email,
                Speciality:User.Speciality,
            },
        });
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


exports.login=async(req,res)=>
{
    try
    {
        const {Email,Password}=req.body;
        if(!Email||!Password)
        {
            return res.status(400).json({success:false,message:"Email Password required"});
        }
        const User=await Chef.findOne({where:{Email}});
        if(!User)
        {
            return res.status(400).json({success:false,message:"email invalid"});
        }
        const Ismatch=await bcrypt.compare(Password,User.Password);
        if(!Ismatch)
        {
            return res.status(400).json({success:false,message:"Password Invaalid"});
        }
        const token=jwt.sign(
            {
               ChefId:User.ChefID,
               Email:User.Email,
            },
            process.env.JWT_SECRET,
            {expiresIn:"48h"},
        );
        return res.status(200).json({success:true,message:"login successfully",token,data:
            {
               ChefID:User.ChefID,
               ChefName:User.ChefName,
               Email:User.Email,
                Speciality:User.Speciality,
            }
        });
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


exports.forgotpassword=async(req,res)=>
{
    try
    {
        const {Email}=req.body;
        if(!Email)
        {
            return res.status(400).json({success:false,message:"email is required"});
        }
        const existed=await Chef.findOne({where:{Email}});
        if(!existed)
        {
            return res.status(400).json({success:false,message:"invalid Email"});
        }
        const resetToken=crypto.randomBytes(32).toString('hex');
        const resetTokenexpired=new Date(Date.now()+5*60*1000);

        existed.Reset_Token=resetToken;
        existed.Reset_Token_Expiry=resetTokenexpired;
        existed.save();

        const resetlink=`${process.env.CLIENT_UR}/reset-password/${resetToken}`;
        console.log("resetlink dev test:",resetlink);

        await transporter.sendMail(
            {
                from:"ganeshrahulggr@gmail.com",
                to:existed.Email,
                subject:"reset link",
                 html: `
                <p>Hello ${existed.UserName},</p>
                <p>You requested a password reset. Click the link below to reset it. This link expires in 5 minutes.</p>
                <p><a href="${resetlink}">${resetlink}</a></p>
                <p>If you did not request this, you can safely ignore this email.</p>`
            },
        );
        return res.status(200).json({success:true,message:"if email existed.reset link share to your email"});
    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { Password } = req.body;

        // CHANGED: token comes from URL
        const { token } = req.params;

        if (!Password) {
            return res.status(400).json({
                success: false,
                message: "Password required"
            });
        }

        if (Password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const User = await Chef.findOne({
            where: {
                Reset_Token: token
            }
        });

        if (!User) {
            return res.status(400).json({
                success: false,
                message: "Token expired"
            });
        }

        if (
            !User.Reset_Token_Expiry ||
            new Date() > new Date(User.Reset_Token_Expiry)
        ) {
            return res.status(400).json({
                success: false,
                message: "Token expired, please request a new one"
            });
        }

        const HashPassword = await bcrypt.hash(Password, 10);

        // CHANGED: HashPasswordl → HashPassword
        User.Password = HashPassword;

        User.Reset_Token = null;
        User.Reset_Token_Expiry = null;

        await User.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

 exports.myProfile = async (req, res) => {
    try {

        

        const details = await Chef.findByPk(
            req.user.ChefId,
            {
                attributes: {
                    exclude: ["Password"]
                }
            }
        );

        if (!details) {
            return res.status(400).json({
                success: false,
                message: "not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "details found",
            data: details
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

exports.Update=async(req,res)=>
{
    try
    {
        const details=await Chef.findByPk(req.params.id);
        if(!details)
        {
            return res.status(400).json({success:false,message:"not found "});
        }
        ChefName, Email, Password,Speciality
        const updates={};
        if(req.body.ChefName) updates.ChefName=req.body.ChefName;
        if(req.body.Email) updates.Email=req.body.Email;
       
        if(req.body.Speciality) updates.Speciality=req.body.Speciality;

        await details.update(updates);

        return res.status(200).json({success:true,message:"updated success fully",data:details});

    }
    catch(e)
    {
        return res.status(500).json({success:false,message:e.message});
    }
};