let io; // Declare variable
exports.socketConnection = (server) => {
  io = require("socket.io")(server, {
    transports: ["polling"],
    cors: {
      cors: {
        origin: "*",
      },
    },
  });
  io.on("connection", (socket) => {
    socket.join(socket.request._query.id);
    socket.on("disconnect", () => {});
  });

  return io;
};

exports.sendMessage = async (topicName, key, message) => {
  try {
    io.emit(topicName, message);
  } catch (error) {
    console.log(error);
  }
}; // Emit data to particular key id

exports.getRooms = () => io.sockets.adapter.rooms;
