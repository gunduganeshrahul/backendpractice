module.exports=(app)=>
{
    
    const CusAUTHController=require("../controllers/CustomerAUTH.controller");
    const AUTHmiddleware=require('../middleware/Auth.MiddleWare');
    const routes=require ('express').Router();

    routes.post('/register',CusAUTHController.register);
    routes.post('/login',CusAUTHController.login);
    routes.get('/',AUTHmiddleware,CusAUTHController.getMyProfile);

    app.use('/api/customers',routes);
}