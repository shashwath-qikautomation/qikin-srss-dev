const { socketConnection, sendMessage } = require("../../socket-io");
const db = require("../models");

const io = socketConnection();

exports.purchaseSocketIo = async (id, status) => {
  try {
    //const data = await db.purchase.findOne({ id: id });
    await sendMessage("data/PURCHASE", "data/PURCHASE", {
      id: id,
      status: status,
    });
  } catch (error) {
    console.log(error);
  }
};
