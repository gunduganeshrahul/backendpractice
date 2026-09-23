module.exports=(app)=>
{
    const VendorController=require('../controllers/Vendor.contoller');
    const authMiddleware=require('../middleware/Auth.MiddleWare');
    const routes=require('express').Router();
    routes.post('/register',VendorController.register);
    routes.post('/login',VendorController.login);
    routes.get('/me', authMiddleware, VendorController.getMyProfile);
    routes.put('/me', authMiddleware, VendorController.updateProfile);
    app.use('/api/vendors',routes);
};