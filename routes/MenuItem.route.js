module.exports=(app)=>
{
    const upload=require('../middleware/upload.middleware');
    const MenuItemController=require('../controllers/MenuItem.controller');
    const middleware=require('../middleware/Auth.MiddleWare');
    const routes=require('express').Router();
    routes.post('/',middleware,upload.single("Image"),MenuItemController.create);
    routes.get('/',MenuItemController.getAll);
    routes.get('/:id',MenuItemController.getById);
    routes.put('/:id',middleware,MenuItemController.update);
    routes.delete('/:id',middleware,MenuItemController.remove);

    app.use('/api/menuitem',routes);
};  