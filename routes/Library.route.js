module.exports=(app)=>
{
const Librarycontroller=require('../controllers/Library.controller');
var routes=require('express').Router();
        routes.post('/',Librarycontroller.create);
        routes.get('/',Librarycontroller.getAll);
        routes.get('/:id',Librarycontroller.getByID);
        routes.put('/:id',Librarycontroller.update);
        routes.delete('/:id',Librarycontroller.remove);

        app.use('/api/libraries',routes);


}
