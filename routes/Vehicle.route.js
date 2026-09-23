module.exports=(app)=>
{
 const VehicleControllers=require('../controllers/Vehicle.controller');

 const routes=require ('express').Router();

 routes.post('/',VehicleControllers.create);
 routes.get('/',VehicleControllers.getAll);
 routes.get('/:id',VehicleControllers.getById);
 routes.put('/:id',VehicleControllers.update);
 routes.delete('/:id',VehicleControllers.remove);

 app.use('/api/vehicles',routes);
}