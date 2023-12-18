const bomController = require("../controllers/bom.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  app.post("/api/bom", [authJwt.verifyToken], bomController.createData); // Create a new data

  app.get("/api/bom", [authJwt.verifyToken], bomController.getAll); // Get all data

  app.get("/api/bom/:id", [authJwt.verifyToken], bomController.getById); // Get a single data by ID

  app.patch("/api/bom/:id", [authJwt.verifyToken], bomController.update); // Update a data by ID

  app.delete("/api/bom/:id", [authJwt.verifyToken], bomController.delete); // Delete a data by ID
};
