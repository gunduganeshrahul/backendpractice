module.exports=(app)=>
{
    const Statecontroller=require('../controllers/State.controller');
    const routes=require('express').Router();

     routes.post('/', Statecontroller.create);
    routes.get('/', Statecontroller.getAll);
    routes.get('/company/:CompanyID', Statecontroller.getByCompany);
    routes.get('/:id', Statecontroller.getByPk);
    app.use('/api/state',routes);
};