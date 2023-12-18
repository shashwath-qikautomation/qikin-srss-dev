const roleController = require("../controllers/role.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  app.post("/api/role", [authJwt.verifyToken], roleController.createRole); // Create a new role

  app.get("/api/role", roleController.getAllRole); // Get all role

  app.get("/api/role/:id", roleController.getRoleById); // Get a single role by ID

  app.patch("/api/role/:id", [authJwt.verifyToken], roleController.updateRole); // Update a role by ID

  app.delete("/api/role/:id", [authJwt.verifyToken], roleController.deleteRole); // Delete a role by ID
};
