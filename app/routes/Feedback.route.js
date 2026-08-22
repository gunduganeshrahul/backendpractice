 module.exports = (app) => {
    const FeedbackController = require('../controllers/Feedback.controller');
    const middleware = require('../middleware/Auth.MiddleWare');
    const routes = require("express").Router();

    routes.post('/', middleware, FeedbackController.create);
    routes.get('/', FeedbackController.getAll);
    routes.get('/:id', FeedbackController.getById);
    routes.put('/:id', middleware, FeedbackController.update);
    routes.delete('/:id', middleware, FeedbackController.remove);

    app.use('/api/feedbacks', routes);
};