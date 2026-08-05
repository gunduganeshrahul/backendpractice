module.exports=(app)=>
{
    const authController=require('../controllers/Auth.controller');
    const routes=require ('express').Router();
   
    routes.post('/register',authController.register);
    routes.post('/login',authController.login);

    app.use("/api/auth",routes);
};