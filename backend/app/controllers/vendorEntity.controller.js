const db = require("../models/index");
const { vendorSocketIo } = require("../other/vendor");
const { ObjectId } = require("mongodb");
// const vendorEntity = require("../models/vendorEntity.model");

//Create New vendor
exports.createVendorEntity = async (req, res) => {
  try {
    let existingVendor = await db.vendorEntity.findOne({
      vendorId: new ObjectId(req.body.vendorId),
    });

    if (existingVendor) {
      if (!existingVendor.vendorQuantity) {
        existingVendor.vendorQuantity = [];
      }

      req.body.vendorQuantity.forEach((newVendorQuantity) => {
        const existingPartIndex = existingVendor.vendorQuantity.findIndex(
          (item) =>
            item.partNumber.toLowerCase() ===
            newVendorQuantity.partNumber.toLowerCase()
        );

        if (existingPartIndex !== -1) {
          existingVendor.vendorQuantity[existingPartIndex].quantity +=
            newVendorQuantity.quantity;
        } else {
          existingVendor.vendorQuantity.push(...req.body.vendorQuantity);
        }
      });

      await existingVendor.save();

      return res.status(200).send(existingVendor);
    } else {
      db.vendorEntity
        .create(req.body)
        .then((data) => {
          //vendorSocketIo(data, 1);
          return res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: "Some error ocurred  while creating the new role.",
          });
        });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

//get all vendor
exports.getAllVendorEntity = async (req, res) => {
  try {
    db.vendorEntity
      .find()
      .populate("vendorId")
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(500).json({
          message: "There was an error while retrieving data.",
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
