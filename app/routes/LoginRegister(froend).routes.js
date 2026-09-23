module.exports=(app)=>
{
    const LoginReg=require('../controllers/LoginRegister(froend).controller');
    
    const routes=require('express').Router();
    routes.post('/login',LoginReg.login);
    routes.post('/register',LoginReg.Register);
    routes.post('/forgot-password',LoginReg.forgotPassword);
    routes.post("/reset-password/:token",LoginReg.resetPassword);

    app.use('/api/LoginReg',routes);
};