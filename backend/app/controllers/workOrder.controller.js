const db = require("../models/index");
const { workOrderSocketIo } = require("../other/workOrder");

//Create New data
exports.create = async (req, res) => {
  try {
    db.workOrder
      .create(req.body)
      .then((data) => {
        workOrderSocketIo(data, 1);
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
    db.workOrder
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
    db.workOrder
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
    db.workOrder
      .findByIdAndUpdate(req.params.id, req.body, {
        useFindAndModify: false,
        new: true,
      })
      .then((data) => {
        if (data) {
          workOrderSocketIo(data, 2);
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

// delete the data
exports.delete = async (req, res) => {
  try {
    db.workOrder
      .findByIdAndRemove(req.params.id)
      .then((data) => {
        workOrderSocketIo(req.params.id, 3);
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
