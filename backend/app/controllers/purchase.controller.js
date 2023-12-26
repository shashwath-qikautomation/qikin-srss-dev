const db = require("../models/index");
const { purchaseSocketIo } = require("../other/purchaseOrder");

//Create New data
exports.create = async (req, res) => {
  try {
    db.purchase
      .create(req.body)
      .then((data) => {
        purchaseSocketIo(data, 1);
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
    db.purchase
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
    db.purchase
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

const incertMany = async (items, description) => {
  try {
    for (let i = 0; i < items.length; i++) {
      await db.inventory.findOneAndUpdate(
        { partNumber: items[i].partNumber },
        {
          partNumber: items[i].partNumber,
          partDescription: description,
          $inc: { quantity: Number(items[i].quantity) },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (req, res) => {
  try {
    db.purchase
      .findByIdAndUpdate(req.params.id, req.body)
      .then(async (data) => {
        console.log(data);
        if (req.body.status == 1) {
          let poList = await db.purchase.findById(req.params.id);
          incertMany(poList.items, poList.description);
        }
        purchaseSocketIo(data, 2);
        return res.send("Successfully Updated");
      })
      .catch((err) => {
        return res.status(500).send({
          message: "There was an error while deleting data.",
        });
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// delete the data
exports.delete = async (req, res) => {
  try {
    db.purchase
      .findByIdAndRemove(req.params.id)
      .then((data) => {
        purchaseSocketIo(req.params.id, 3);
        return res.send("Successfully deleted");
      })
      .catch((err) => {
        return res.status(500).send({
          message: "There was an error while deleting data.",
        });
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
