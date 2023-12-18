const workOrderController = require("../controllers/workOrder.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  app.post("/api/workOrder", [authJwt.verifyToken], workOrderController.create); // Create a new data

  app.get("/api/workOrder", [authJwt.verifyToken], workOrderController.getAll); // Get all data

  app.get(
    "/api/workOrder/:id",
    [authJwt.verifyToken],
    workOrderController.getById
  ); // Get a single data by ID

  app.patch(
    "/api/workOrder/:id",
    [authJwt.verifyToken],
    workOrderController.update
  ); // Update a data by ID

  app.delete(
    "/api/workOrder/:id",
    [authJwt.verifyToken],
    workOrderController.delete
  ); // Delete a data by ID
};
