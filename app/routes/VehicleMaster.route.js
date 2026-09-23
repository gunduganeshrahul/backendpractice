module.exports=(app)=>
{
    const vecicleMaster=require('../controllers/VehicleMaster.Controller');
    const routes=require('express').Router();
    routes.post('/',vecicleMaster.create);
    routes.get('/',vecicleMaster.getAll);

    app.use('/api/vehicleMaster',routes);
};