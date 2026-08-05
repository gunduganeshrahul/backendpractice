module.exports=(app)=>
{
    const CourseController=require('../controllers/Course.controller');
    var routes =require('express').Router();
    routes.post('/',CourseController.create);
    routes.get('/',CourseController.getAll);
    routes.get('/:id',CourseController.getById);
    routes.put('/:id',CourseController.update);
    routes.delete('/:id',CourseController.remove);

    app.use("/api/courses",routes);
}