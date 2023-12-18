const { sendMessage } = require("../../socket-io");
const db = require("../models");

exports.roleSocketIo = async (id, status) => {
  try {
    await sendMessage("data/ROLES", "data/ROLES", { id: id, status: status });
  } catch (error) {
    console.log(error);
  }
};
