 module.exports = (app) => {
  const loginregisterController = require('../controllers/loginregister.cotroller');
  const routes = require('express').Router();
  routes.post('/register', loginregisterController.register);
  routes.post('/login', loginregisterController.login);
  app.use('/api/pages', routes);
};