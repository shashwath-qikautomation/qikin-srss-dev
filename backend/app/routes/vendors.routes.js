const vendorController = require("../controllers/vendor.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  app.post(
    "/api/vendors",
    [authJwt.verifyToken],
    vendorController.createVendor
  ); // create a new vendor

  app.get("/api/vendors", vendorController.getAllVendor); // Get all vendor

  //app.get("/api/vendors/:id", vendorController.getVendorById); // Get a single vendor by ID

  app.patch(
    "/api/vendors/:id",
    [authJwt.verifyToken],
    vendorController.updateVendor
  ); // Update a vendor by ID

  app.delete(
    "/api/vendors/:id",
    [authJwt.verifyToken],
    vendorController.deleteVendor
  ); // Delete a vendor by ID
};
