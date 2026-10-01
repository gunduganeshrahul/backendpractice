module.exports=(app)=>
{
    const citycontroller=require('../controllers/city.controller');
    const routes=require('express').Router();

    routes.post('/', citycontroller.create);
routes.get('/', citycontroller.getAll);
routes.get('/state/:StateID', citycontroller.getByState);
routes.get('/:id', citycontroller.getByPk);

    app.use('/api/city',routes);
};