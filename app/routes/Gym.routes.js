module.exports=(app)=>
{
    const GymController=require('../controllers/Gym.controller');
    const authMiddleware=require('../middleware/Auth.MiddleWare');
    const routes=require('express').Router();

    routes.post('/',authMiddleware,GymController.create);
    routes.get('/',GymController.getAll);
    routes.get('/:id',GymController.getById);
    routes.put('/:id',authMiddleware,GymController.update);
    routes.delete('/:id',authMiddleware,GymController.remove);
    app.use('/api/gym',routes);
}
