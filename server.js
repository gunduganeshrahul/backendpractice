 const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Database
const db = require("./models");

// ===============================
// Middleware
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// ===============================
// Test API
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running successfully"
  });
});


// ===============================
// Routes
// ===============================

require('./routes/AdminRegister.route')(app);
//
require('./routes/Auth.route')(app);
//
require('./routes/Authreg.route')(app);
//
require('./routes/Automotiveindustry.route')(app);
//
require("./routes/Course.route")(app);
//
require("./routes/CustomerAUTH.route")(app);
//
require('./routes/Doctor.route')(app);
//
require('./routes/Employee.route')(app);
//
require('./routes/Feedback.route')(app);
//
require('./routes/Gym.routes')(app);
//
require('./routes/Invoice.route')(app);
//
require('./routes/Library.route')(app);
//
require('./routes/LoginRegister(froend).routes')(app);
//
require('./routes/Patient.route')(app);
//
require('./routes/Product.route')(app);
//
require('./routes/Registration.route')(app);
//
require('./routes/Service.routes')(app);
//
require('./routes/Staff.routes')(app);
//
require('./routes/StudentInformation.route')(app);
//
require('./routes/Supplier.route')(app);
//
require('./routes/Teacher.route')(app);
//
require('./routes/Trainer.routes')(app);
//
require('./routes/Vehicle.route')(app);
//
require('./routes/VehicleMaster.route')(app);
//
require('./routes/Vendor.route')(app);
//
require('./routes/logic.route')(app);
//
require('./routes/loginregister.route')(app);
//
require('./routes/MenuItem.route')(app);
//
require('./routes/Chef.route')(app);
//
require("./routes/Speciality.routes")(app);
// ===============================
// Database Connection
// ===============================

db.sequelize
  .authenticate()
  .then(() => {

    console.log("PostgreSQL connected successfully");

    return db.sequelize.sync();

  })
  .then(() => {

    console.log("Tables synchronized successfully");

    const PORT = process.env.PORT || 9090;

    app.listen(PORT, () => {

      console.log(`Server running on port ${PORT}`);

    });

  })
  .catch((error) => {

    console.error("Database error:", error);

  });