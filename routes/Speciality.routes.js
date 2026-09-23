module.exports=(app)=>
{
    const SpecialityController=require('../controllers/Speciality.controller');
    const routes=require('express').Router();

    routes.post("/",SpecialityController.create);

    app.use('/api/speciality',routes);
};