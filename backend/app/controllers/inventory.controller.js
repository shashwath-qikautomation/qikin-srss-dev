const db = require("../models/index");
const { inventorySocketIo } = require("../other/inventory");

//Create New data
exports.create = async (req, res) => {
  try {
    db.inventory
      .create(req.body)
      .then((data) => {
        console.log(data);
        inventorySocketIo(data, 1);
        return res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Some error ocurred  while creating the data.",
        });
      });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Get all data
exports.getAll = (req, res) => {
  try {
    db.inventory
      .find()
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

// get data by id
exports.getById = (req, res) => {
  try {
    db.inventory
      .findById(req.params.id)
      .then((data) => {
        if (data) {
          res.status(200).json(data);
        } else {
          return res.status(400).json({ message: "Invalid ID." });
        }
      })

      .catch((err) => {
        return res.status(500).json({
          message: "There was an error while retrieving Data.",
        });
      });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// update the data
exports.update = async (req, res) => {
  try {
    db.inventory
      .findByIdAndUpdate(req.params.id, req.body, {
        useFindAndModify: false,
        new: true,
      })
      .then((data) => {
        if (data) {
          inventorySocketIo(data, 2);
          res.status(200).send(data);
        } else {
          return res.status(400).send({ message: "Invalid ID." });
        }
      })

      .catch((err) => {
        return res.status(500).send({
          message: "There was an error while update data.",
        });
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.upsert = async (req, res) => {
  try {
    let existingItem = await db.inventory.findOne({
      partNumber: req.body.partNumber,
    });

    if (existingItem) {
      existingItem.quantity =
        parseInt(existingItem.quantity) + parseInt(req.body.quantity);

      const updatedItem = await existingItem.save();
      return res.status(200).send(updatedItem);
    } else {
      const newItem = new db.inventory({
        part: req.body.part,
        partNumber: req.body.partNumber,
        quantity: req.body.quantity,
        partDescription: req.body.partDescription,
        manufacture: req.body.manufacture,
        boxNumber: req.body.boxNumber,
      });
      const savedItem = await newItem.save();
      inventorySocketIo(newItem, 1);
      return res.status(201).send(savedItem);
    }
  } catch (error) {
    return res.status(500).send({
      message: "There was an error processing the request.",
      error: error.message,
    });
  }
};

// delete the data
exports.delete = async (req, res) => {
  try {
    db.inventory
      .findByIdAndRemove(req.params.id)
      .then((data) => {
        inventorySocketIo(req.params.id, 3);
        return res.json("Successfully deleted");
      })
      .catch((err) => {
        return res.status(500).json({
          message: "There was an error while deleting data.",
        });
      });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
