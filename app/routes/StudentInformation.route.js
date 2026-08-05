 module.exports = (app) => {
    const StudentInformation = require('../controllers/StudentInfromation.controller');  // matches your real file
    var routes = require('express').Router();

    routes.post('/', StudentInformation.create);
    routes.get('/', StudentInformation.getAll);
    routes.get('/:id', StudentInformation.getById);
    routes.put('/:id', StudentInformation.update);
    routes.delete('/:id', StudentInformation.remove);
    app.use('/api/studentinformation', routes);
};