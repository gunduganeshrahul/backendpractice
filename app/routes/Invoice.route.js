module.exports=(app)=>
{
    const InvoiceController=require('../controllers/Invoice.controller');
    const routes=require('express').Router();

    routes.post('/',InvoiceController.create);
    routes.get('/',InvoiceController.getAll);
    routes.get('/:id',InvoiceController.getById);
    routes.put('/:id',InvoiceController.update);
    routes.delete('/:id',InvoiceController.revome);

    app.use('/api/invoices',routes);
}