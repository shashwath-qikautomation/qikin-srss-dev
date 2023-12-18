const db = require("../../models/index");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
const config = require("../../config/constant");
const { userSocketIo } = require("../../other/user");
const { sendMessage } = require("../../../socket-io");

// setTimeout(async () => {
//   try {
//     console.log("hi");
//     await sendMessage("data/USER", "data/USER", "data");
//   } catch (error) {
//     console.log(error);
//   }
// }, 6000);
//Create New user
exports.createUser = async (req, res, io) => {
  try {
    db.user
      .create(req.body)
      .then((data) => {
        userSocketIo(data, 1);
        //return res.status(200).json(data);
        return res.status(200).send({
          data: data,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          message: "There was an error while creating user.",
        });
      });
  } catch (err) {
    return res.status(500).send({
      message: "Some error occurred while creating the user. " + err.message,
    });
  }
};
// Get all user
exports.getAllUser = (req, res) => {
  try {
    db.user
      .find()
      .populate("role")

      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((err) => {
        return res.status(500).json({
          message: "There was an error while retrieving user.",
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    let user = await db.user.findOne({ userId: req.body.userId });

    if (user) {
      let tokenPayload = jwt.sign(
        {
          id: user._id,
          firstName: user.firstName,
          ip: req.ip,
        },
        config.secret
      );
      return res.status(200).json({
        message: "Signed in successfully!",
        token: tokenPayload,
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" + error.message });
  }
};

// get user by id
exports.getByIdUser = (req, res) => {
  try {
    db.user
      .findById(req.params.id)
      .populate("role")
      .then((data) => {
        if (data) {
          res.status(200).json(data);
        } else {
          return res.status(400).json({ message: "Invalid ID." });
        }
      })

      .catch((err) => {
        return res.status(500).json({
          message: "There was an error while retrieving user.",
        });
      });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// update the user
exports.updateUser = async (req, res, io) => {
  try {
    // req.body.password = bcrypt.hashSync(req.body.password, 10);

    await db.user
      .findByIdAndUpdate(req.params.id, req.body, {
        useFindAndModify: false,
        new: true,
      })
      .then((data) => {
        if (data) {
          userSocketIo(data, 2);
          res.status(200).send(data);
        } else {
          res.status(400).send({ message: "Invalid ID." });
        }
      })
      .catch((error) => {
        res.status(500).send({
          message:
            "There was an error while updating the user: " + error.message,
        });
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// delete the user
exports.deleteUser = async (req, res) => {
  try {
    db.user
      .findByIdAndRemove(req.params.id)
      .then((data) => {
        /*if (!data) {
          return res
            .status(404)
            .json({ message: "No user found with that ID." });
        } else {
          req.io.emit("userDeleted", { userId: req.params.id });
          return res.json("Successfully deleted");
        }*/
        userSocketIo(req.params.id, 3);
        return res
          .status(200)
          .send({ message: "User was deleted successfully" });
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
