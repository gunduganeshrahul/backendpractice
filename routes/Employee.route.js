module.exports=(app)=>
{
    const empconroller=require('../controllers/Employee.controller');
    const routes=require('express').Router();
    routes.post('/',empconroller.create);
    routes.get('/',empconroller.getAll);
    routes.get('/:id',empconroller.getById);
    routes.put('/:id',empconroller.update);
    routes.delete('/:id',empconroller.remove);

    app.use("/api/employees",routes);
}