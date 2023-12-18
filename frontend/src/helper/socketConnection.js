import { io } from "socket.io-client";
import apis from "../services/apis";

const URL =
  /*process.env.NODE_ENV === "production" ? undefined :*/ apis.socketPath;
console.log(URL);
export const socket = io(URL, { autoConnect: false });
console.log(socket);
