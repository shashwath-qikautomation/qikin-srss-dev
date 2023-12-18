const purchaseController = require("../controllers/purchase.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  app.post("/api/purchase", [authJwt.verifyToken], purchaseController.create); // Create a new data

  app.get("/api/purchase", [authJwt.verifyToken], purchaseController.getAll); // Get all data

  app.get(
    "/api/purchase/:id",
    [authJwt.verifyToken],
    purchaseController.getById
  ); // Get a single data by ID

  app.patch(
    "/api/purchase/:id",
    [authJwt.verifyToken],
    purchaseController.update
  ); // Update a data by ID

  app.delete(
    "/api/purchase/:id",
    [authJwt.verifyToken],
    purchaseController.delete
  ); // Delete a data by ID
};
