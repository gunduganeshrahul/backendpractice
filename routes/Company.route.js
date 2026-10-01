module.exports=(app)=>
{
    const Companycontroller=require('../controllers/Company.controller');
    const routes=require('express').Router();

    routes.post('/',Companycontroller.create);
    routes.get('/',Companycontroller.getAll);
    routes.get('/:id',Companycontroller.getbyId);

    app.use('/api/company',routes);
};