module.exports=(app)=>
{
    const TeacherController=require('../controllers/Teacher.controller');
    var routes=require('express').Router();

    routes.post('/',TeacherController.create);
    routes.get('/',TeacherController.getAll);
    routes.get('/:id',TeacherController.getById);
    routes.put('/:id',TeacherController.update);
    routes.delete('/:id',TeacherController.remove);

    app.use('/api/teachers',routes);
// move to index.js
}