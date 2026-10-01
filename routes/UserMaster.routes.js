 module.exports = (app) => {

    const UserMastercontroller = require("../controllers/UserMaster.controller");

    const routes = require("express").Router();


    // Create User
    routes.post("/", UserMastercontroller.create);


    // Get all Users
    routes.get("/", UserMastercontroller.getAll);


    // Get User by ID
    routes.get("/:id", UserMastercontroller.getByID);


    app.use("/api/usermaster", routes);
};