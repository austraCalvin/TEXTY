import { Socket } from "socket.io";
import { IClientToServerEvents, IServerToClientEvents, IInterServerEvents } from "./SocketEvents";

type UserWebSocket = Socket<IClientToServerEvents, IServerToClientEvents, IInterServerEvents>

export default UserWebSocket