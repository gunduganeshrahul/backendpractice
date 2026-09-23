 module.exports = (app) => {
    const PatientController = require('../controllers/Patient.controller');
    const middleware = require('../middleware/Auth.MiddleWare');
    const routes = require('express').Router();

    routes.post('/', middleware, PatientController.create);

    routes.get('/', PatientController.getAll);

    routes.get('/:id', PatientController.getByID);

    routes.put('/:id', middleware, PatientController.update);

    routes.delete('/:id', middleware, PatientController.remove);

    app.use('/api/patients', routes);
};