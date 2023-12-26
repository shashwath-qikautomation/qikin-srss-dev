const { socketConnection, sendMessage } = require("../../socket-io");
const db = require("../models");

const io = socketConnection();

exports.vendorSocketIo = async (id, status) => {
  try {
    await sendMessage("data/VENDORS", "data/VENDORS", {
      id: id,
      status: status,
    });
  } catch (error) {
    console.log(error);
  }
};
