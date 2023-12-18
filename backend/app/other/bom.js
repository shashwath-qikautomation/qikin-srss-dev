const { socketConnection, sendMessage } = require("../../socket-io");
const db = require("../models");

const io = socketConnection();

exports.bomSocketIo = async (id, status) => {
  try {
    await sendMessage("data/PRODUCTS", "data/PRODUCTS", {
      id: id,
      status: status,
    });
  } catch (error) {
    console.log(error);
  }
};
