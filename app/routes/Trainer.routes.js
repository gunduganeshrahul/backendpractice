module.exports=(app)=>
{
    const TrainerController=require('../controllers/Trainer.controller');
    const routes=require('express').Router();
    routes.post('/register',TrainerController.register);
    routes.post('/login',TrainerController.login);

    app.use('/api/trainer',routes);
};