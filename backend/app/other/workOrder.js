const { sendMessage } = require("../../socket-io");
const db = require("../models");

exports.workOrderSocketIo = async (id, status) => {
  try {
    await sendMessage("data/WORK_ORDER", "data/WORK_ORDER", {
      id: id,
      status: status,
    });
  } catch (error) {
    console.log(error);
  }
};
