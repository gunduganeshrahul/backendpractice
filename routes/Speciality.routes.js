module.exports=(app)=>
{
    const SpecialityController=require('../controllers/Speciality.controller');
    const routes=require('express').Router();

    routes.post("/",SpecialityController.create);
    routes.get('/',SpecialityController.getAll);

    app.use('/api/speciality',routes);
    
};