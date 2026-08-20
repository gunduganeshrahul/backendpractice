module.exports=(app)=>
{
    const ServiceController=require('../controllers/Service.controller');
    const middleware=require('../middleware/Auth.MiddleWare');
    const routes=require('express').Router();
    routes.post('/',middleware,ServiceController.create);
    routes.get('/',ServiceController.getAll);
    routes.get('/:id',ServiceController.getById);
    routes.put('/:id',middleware,ServiceController.update);
    routes.delete('/:id',middleware,ServiceController.remove);
    app.use('/api/services',routes);

};