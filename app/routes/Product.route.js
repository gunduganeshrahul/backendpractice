module.exports=(app)=>
{
    const Productcontroller=require("../controllers/Product.controller")
    const routes=require('express').Router();
    routes.post('/',Productcontroller.create);
    routes.get('/',Productcontroller.getAll);
    routes.get('/:id',Productcontroller.getById);
    routes.put("/:id",Productcontroller.update);
    routes.delete("/:id",Productcontroller.remove);

    app.use("/api/products",routes);
}