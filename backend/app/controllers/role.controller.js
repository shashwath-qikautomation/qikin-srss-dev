const db = require("../models/index");
const { roleSocketIo } = require("../other/roles");

//Create New role
exports.createRole = async (req, res) => {
  try {
    db.role
      .create(req.body)
      .then((data) => {
        roleSocketIo(data, 1);
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

// Get all role
exports.getAllRole = (req, res) => {
  try {
    db.role
      .find()
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(500).json({
          message: "There was an error while retrieving role.",
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get role by id
exports.getRoleById = (req, res) => {
  try {
    db.role
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
          message: "There was an error while retrieving role.",
        });
      });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// update the role
exports.updateRole = async (req, res) => {
  try {
    db.role
      .findByIdAndUpdate(req.params.id, req.body, {
        useFindAndModify: false,
        new: true,
      })
      .then((data) => {
        if (data) {
          roleSocketIo(data, 2);
          res.status(200).send(data);
        } else {
          return res.status(400).send({ message: "Invalid ID." });
        }
      })

      .catch((err) => {
        return res.status(500).send({
          message: "There was an error while update role.",
        });
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// delete the role
exports.deleteRole = async (req, res) => {
  try {
    db.role
      .findByIdAndRemove(req.params.id)
      .then((data) => {
        roleSocketIo(req.params.id, 3);
        return res.send("Successfully deleted");
      })
      .catch((err) => {
        return res.status(500).send({
          message: "There was an error while deleting role.",
        });
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
