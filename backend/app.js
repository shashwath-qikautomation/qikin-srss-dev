const express = require("express");
const app = express();
const db = require("./app/models/index");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);
const httpContext = require("express-http-context");
const uuid = require("uuid");
const { socketConnection } = require("./socket-io");

const config = require("./app/config/constant");

app.use(
  cors(
    { origin: "*" }
    // {
    // origin: function (origin, callback) {
    //   if (!origin) return callback(null, true)

    //   if (origin.indexOf("localhost:") !== -1) {
    //     callback(null, true)
    //   } else {
    //     callback(new Error("Not allowed by CORS"))
    //   }
    // },
    // }
  )
);

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(httpContext.middleware);
app.use(function (req, res, next) {
  httpContext.set("reqId", uuid.v1());
  next();
});

// Middleware to verify token
// let verifyToken = async (req, res, next) => {
//   let token = req.headers["x-access-token"];
//   if (!token) {
//     return res.status(403).send({ message: "No token provided!" });
//   }
//   jwt.verify(token, config.secret, async (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "Unauthorized!" });
//     }
//     const User = await db.users.findById(decoded.id);
//     if (User) {
//       jwt.verify(User.token, config.secret, async (err, decodedUser) => {
//         if (err) {
//           return res.status(401).send({ message: "Unauthorized!" });
//         }
//         if (decoded.ip == decodedUser.ip) {
//           req.firstName = decoded.firstName;
//           req.lastName = decoded.lastName;
//           req.userIp = decoded.ip;
//           next();
//         } else {
//           return res.status(401).send({ message: "Unauthorized!" });
//         }
//       });
//     } else {
//       return res.status(401).send({ message: "Unauthorized!" });
//     }
//   });
// };

// function authenticateToken(req, res, next) {
//   console.log("hiiii");
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.status(401).send("Access Denied");

//   jwt.verify(token, config.secret, (err, user) => {
//     if (err) return res.status(403).send("Invalid Token");
//     req.user = user;
//     next();
//   });
// }

require("./app/routes/user/user.route")(app);
require("./app/routes/inventory.route")(app);
require("./app/routes/bom.route")(app);
require("./app/routes/workOrder.route")(app);
require("./app/routes/role.route")(app);
require("./app/routes/purchase.routes")(app);
require("./app/routes/vendors.routes")(app);
require("./app/routes/vendorEntity.route")(app);

const PORT = 8081;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

server.maxConnections = 100;
server.listen(8085, () => {
  console.log(`Socket server is running on port 8085.`);
});
socketConnection(server);
module.exports = () => app;
