exports.calculator=(req,res)=>
{
    try
    {
        const{a,b,operators}=req.body;
        if(a===undefined|| b===undefined ||operators===undefined)
        {
            return res.status(400).json({success:false,message:"a,b value or required"})
        }
        let result;
        if(operators ==="addtion")
        {
            result=a+b;
        }
        else if(operators ==="substration")
        {
            result=a-b;
        }
        else if(operators === "multiplication")
        {
            result=a*b;
        }
        else if(operators === "divison")
        {
            if(b === 0)
            {
                return res.status(400).json({success:false,message:"canot divide by 0"});
            }
            result=a/b;
        }
        else{
            return res.status(400).json({success:false,meesage:"give valid operators"});
        }
        return res.status(200).json({success:true,operators:operators,data:result});
    }
    catch(err)
    {
        return res.status(500).json({success:false,message:err.message});
    }
}