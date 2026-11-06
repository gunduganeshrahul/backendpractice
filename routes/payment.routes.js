module.exports = (app) => {
  const PaymentController = require("../controllers/payment.controller");
  const routes = require("express").Router();

  routes.post("/orders", PaymentController.createOrder);
  routes.post("/verify", PaymentController.verifyPayment);

  app.use("/api/payments", routes);
};
