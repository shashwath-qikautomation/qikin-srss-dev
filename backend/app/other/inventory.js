const { socketConnection, sendMessage } = require("../../socket-io");
const db = require("../models");

const io = socketConnection();

exports.inventorySocketIo = async (id, status) => {
  try {
    await sendMessage("data/INVENTORY", "data/INVENTORY", {
      id: id,
      status: status,
    });
  } catch (error) {
    console.log(error);
  }
};
