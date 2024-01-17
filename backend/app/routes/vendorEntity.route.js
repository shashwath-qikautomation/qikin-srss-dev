const vendorEntityController = require("../controllers/vendorEntity.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  // create a new vendor entity
  app.post(
    "/api/vendors-entity",
    [authJwt.verifyToken],
    vendorEntityController.createVendorEntity
  );

  // Get all vendor Entity
  app.get(
    "/api/vendors-entity",
    [authJwt.verifyToken],
    vendorEntityController.getAllVendorEntity
  );
};
