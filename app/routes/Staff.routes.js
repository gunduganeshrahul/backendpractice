module.exports=(app)=>
{
    const StaffController=require('../controllers/Staff.controller');
    const Middleware=require('../middleware/Auth.MiddleWare');
    const routes=require('express').Router();
    routes.post('/register',StaffController.register);
    routes.post('/login',StaffController.Login);
    routes.get('/me',Middleware,StaffController.getMyProfile);
    routes.put('/me/:id',Middleware,StaffController.getProfileUpdate);

    app.use('/api/staffs',routes);

};