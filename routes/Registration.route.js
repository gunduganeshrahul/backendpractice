module.exports=(app)=>
{
    const registerController=require('../controllers/Registration.controller')
    const routes=require('express').Router();
    routes.post('/',registerController.register);
    app.use('/api/registerpage',routes);
};