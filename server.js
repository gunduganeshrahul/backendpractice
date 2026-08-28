const express=require('express');
const app=express();
app.use(express.json());
const db=require('./app/models');
const cors = require("cors");
app.use(cors());

db.sequelize
.authenticate()
.then(()=> console.log("data base connected sucessfully"))
.catch((err)=> console.log("unable to connect to the data base:",err));
// after db add we have to write this one
db.sequelize
.sync({alter:true})
.then(()=> console.log("table synced."))
.catch((err)=> console.error('sync error:',err));
require("./app/routes/Teacher.route.js")(app);
//
require("./app/routes/StudentInformation.route.js")(app);
//
require("./app/routes/Course.route.js")(app);
//
require('./app/routes/Library.route.js')(app);
//
require('./app/routes/logic.route.js')(app);
//
require('./app/routes/Employee.route.js')(app);
//
require('./app/routes/Product.route.js')(app);
//
require('./app/routes/Vehicle.route.js')(app);
//
require('./app/routes/Auth.route.js')(app);
//
require('./app/routes/Authreg.route.js')(app);
//
require('./app/routes/CustomerAUTH.route.js')(app);
//
require('./app/routes/Invoice.route.js')(app);
//
require("./app/routes/AdminRegister.route.js")(app);
//
require('./app/routes/Gym.routes.js')(app);
//
require('./app/routes/Trainer.routes.js')(app);
//
require('./app/routes/loginregister.route.js')(app);
//
require('./app/routes/Vendor.route.js')(app);
//
require('./app/routes/Service.routes.js')(app);
//
require('./app/routes/Staff.routes.js')(app);
//
require('./app/routes/Patient.route.js')(app);
//
require('./app/routes/Doctor.route.js')(app);
//
require('./app/routes/Feedback.route.js')(app);
//
require('./app/routes/Registration.route.js')(app);
//
require('./app/routes/Automotiveindustry.route.js')(app);
app.get('/',(req,res)=>
{
res.json({message:"surver is running."});
});

const PORT=process.env.PORT || 8080;
app.listen(PORT,()=>
{
    console.log(`server running on port ${PORT}`);
});