module.exports=(app)=>
{
     const Suppliercontroller=require('../controllers/Supplier.controller');
     const routes=require('express').Router();

     routes.post('/register',Suppliercontroller.Register);
     routes.post('/login',Suppliercontroller.Login);
     routes.post('/forgot-password',Suppliercontroller.ForgotPassword);
     routes.post('/reset-password/:token',Suppliercontroller.ResetPassword);

     app.use('/api/supplier',routes);
};