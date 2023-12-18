const { socketConnection, sendMessage } = require("../../socket-io");
const db = require("../models");

exports.userSocketIo = async (id, status) => {
  try {
    console.log("Socket user");
    //const data = await db.user.findById(id);
    console.log(id);
    await sendMessage("data/USER", "data/USER", { id: id, status: status });
  } catch (error) {
    console.log(error);
  }
};
