module.exports=(app)=>
{
    const authregController=require("../controllers/authreg.controller");
    const routes=require('express').Router();
    routes.post('/register',authregController.register);

    app.use("/api/authreg",routes);
}