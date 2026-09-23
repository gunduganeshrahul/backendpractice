module.exports=(app)=>
{
    const ChefController=require('../controllers/Chef.controller');
    const routes=require('express').Router();
   
    routes.post('/register',ChefController.register);
    routes.post('/login',ChefController.login);
    routes.post('/forgotpassword',ChefController.forgotpassword);
    routes.post('/reset-password/:token',ChefController.resetPassword);
    routes.get('/me',ChefController.myProfile);
    routes.put('./id',ChefController.Update);
    app.use('/api/chef',routes);
};