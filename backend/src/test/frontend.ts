import { io, Socket } from "socket.io-client";
import { IClientToServerEvents, IServerToClientEvents } from "../Types/SocketEvents";

const currentUser: Socket<IServerToClientEvents, IClientToServerEvents> = io("ws://127.0.0.1:27017", { "withCredentials": true });

// "message-to-deliver"
// "message-to-read"
// "contact-online"
// "contact-offline"
// "message-status"

currentUser.on("message-to-deliver", (message) => {



});