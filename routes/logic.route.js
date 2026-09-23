 module.exports = (app) => {

    const logic = require("../controllers/Logic.controller");
    const routes = require("express").Router();

    routes.post("/", logic.calculator);

    app.use("/api/calculator", routes);

}; 