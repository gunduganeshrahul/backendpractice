 module.exports=(app)=>
 {
    const AutomotiveController=require('../controllers/Automotiveindustry.controller');
    const routes=require('express').Router();
    routes.post('/',AutomotiveController.create);
    routes.get('/',AutomotiveController.getAll);
    routes.get('/:id',AutomotiveController.getById);
    routes.put('/:id',AutomotiveController.update);
    routes.delete('/:id',AutomotiveController.remove);

    app.use("/api/automotive",routes);
 };