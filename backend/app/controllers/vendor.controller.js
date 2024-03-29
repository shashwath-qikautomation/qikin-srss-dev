const db = require("../models/index");
const { vendorSocketIo, vendorEntitySocketIo } = require("../other/vendor");

//Create New vendor
exports.createVendor = async (req, res) => {
  try {
    db.vendor
      .create(req.body)
      .then((data) => {
        vendorSocketIo(data, 1);
        return res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Some error ocurred  while creating the new role.",
        });
      });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

//get all vendor
exports.getAllVendor = (req, res) => {
  try {
    db.vendor
      .find()
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(500).json({
          message: "There was an error while retrieving vendor.",
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update the vendor
exports.updateVendor = async (req, res, io) => {
  try {
    // req.body.password = bcrypt.hashSync(req.body.password, 10);

    await db.vendor
      .findByIdAndUpdate(req.params.id, req.body, {
        useFindAndModify: false,
        new: true,
      })
      .then((data) => {
        if (data) {
          vendorSocketIo(data, 2);
          res.status(200).send(data);
        } else {
          res.status(400).send({ message: "Invalid ID." });
        }
      })
      .catch((error) => {
        res.status(500).send({
          message:
            "There was an error while updating the vendor: " + error.message,
        });
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// delete the vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendorData = await db.vendor.findById(req.params.id);

    if (!vendorData) {
      return res.status(404).send({ message: "Vendor not found" });
    }

    await db.vendor.findByIdAndRemove(req.params.id);
    vendorSocketIo(req.params.id, 3);

    // Delete vendorEntity
    const vendorEntityData = await db.vendorEntity.findOneAndRemove({
      vendorId: req.params.id,
    });

    vendorEntitySocketIo(vendorEntityData._id, 3);

    return res
      .status(200)
      .send({ message: "Vendor and VendorEntity were deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
