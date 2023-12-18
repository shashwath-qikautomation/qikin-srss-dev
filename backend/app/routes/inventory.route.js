const inventoryController = require("../controllers/inventory.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  app.post("/api/inventory", [authJwt.verifyToken], inventoryController.create); // Create a new data

  app.post(
    "/api/inventory/upsert",
    [authJwt.verifyToken],
    inventoryController.upsert
  ); //inserting a new data to existing data
  app.get("/api/inventory", [authJwt.verifyToken], inventoryController.getAll); // Get all data

  app.get(
    "/api/inventory/:id",
    [authJwt.verifyToken],
    inventoryController.getById
  ); // Get a single data by ID

  app.patch(
    "/api/inventory/:id",
    [authJwt.verifyToken],
    inventoryController.update
  ); // Update a data by ID

  app.delete(
    "/api/inventory/:id",
    [authJwt.verifyToken],
    inventoryController.delete
  ); // Delete a data by ID
};
