 module.exports = (app) => {
  const AdminREGController = require("../controllers/AdminRegiter.Auth.Controller");
  const authMiddleware = require("../middleware/auth.middleware");
  const routes = require('express').Router();

  routes.post('/register', AdminREGController.register);
  routes.post('/login', AdminREGController.login);
  routes.get('/profile', authMiddleware, AdminREGController.profile);

  app.use('/api/adminreg', routes);
};