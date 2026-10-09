 module.exports = (app) => {

    const controller = require('../controllers/Candidate.controller');
    const routes = require('express').Router();


    // =========================
    // Department
    // =========================

    routes.post("/department", controller.createDepartment);
    routes.get("/department", controller.getAllDepartments);
    routes.get("/department/:id", controller.getDepartmentById);


    // =========================
    // Designation
    // =========================

    routes.post("/designation", controller.createDesignation);
    routes.get("/designation", controller.getAllDesignations);
    routes.get("/designation/department/:DepartmentID",controller.getDesignationByDepartment);
    routes.get("/designation/:id", controller.getDesignationById);


    // =========================
    // Candidate
    // =========================

    routes.post("/candidate", controller.createCandidate);
    routes.get("/candidate", controller.getAllCandidates);
    routes.get("/candidate/designation/:DesignationID",controller.getCandidatesByDesignation);
    routes.get("/candidate/:id", controller.getCandidateById);
    routes.put("/candidate/:id", controller.updateCandidate);
    routes.delete("/candidate/:id", controller.deleteCandidate);


    app.use("/api/candidate", routes);
};