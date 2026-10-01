 module.exports = (app) => {
    const Branchcontroller = require('../controllers/Branch.controller');
    const routes = require('express').Router();

    routes.post('/', Branchcontroller.create);
    routes.get('/', Branchcontroller.getAll);

    // Get branches by selected City
    routes.get('/city/:CityID', Branchcontroller.getByCity);

    // Get branch by ID
    routes.get('/:id', Branchcontroller.getByPk);

    app.use('/api/branch', routes);
};