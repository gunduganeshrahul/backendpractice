module.exports=(app)=>
{
    const DoctorController=require('../controllers/Doctor.controller');
    const middleware=require('../middleware/Auth.MiddleWare');
    const routes=require('express').Router();
    routes.post('/register',DoctorController.register);
    routes.post('/login',DoctorController.Login);
    routes.get('/me',middleware,DoctorController.getMyProfile);
    routes.put('/me',middleware,DoctorController.updateMyProfile);

    app.use('/api/doctors',routes);
};