 const jwt=require('jsonwebtoken');
 module.exports=(req,res,next)=>
    {
        const authHeader=req.headers.authorization;
        if(!authHeader)
        {
            return res.status(401).json({success:false,message:"token invalid"});
        }
        const token=authHeader.split(" ")[1];
        try
        {
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decoded;
            next();
        }
        catch(e)
        {
            return res.status(401).json({success:false,message:"invalid or token expried"});
        }
    };