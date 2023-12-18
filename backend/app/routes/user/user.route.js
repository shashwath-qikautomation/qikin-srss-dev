const userController = require("../../controllers/user/user.controller");
const { authJwt } = require("../../middleware");

module.exports = (app) => {
  app.post("/api/login", userController.signIn); // SignIn for user
  app.post("/api/user", [authJwt.verifyToken], userController.createUser); // Create a new user

  app.get("/api/user", userController.getAllUser); // Get all user

  app.get("/api/user/:id", userController.getByIdUser); // Get a single user by ID

  app.patch("/api/user/:id", [authJwt.verifyToken], userController.updateUser); // Update a user by ID

  app.delete("/api/user/:id", [authJwt.verifyToken], userController.deleteUser); // Delete a user by ID
};
