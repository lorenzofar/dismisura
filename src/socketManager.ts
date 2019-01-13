import { Server } from "http";
import * as socket_io from "socket.io";

var io: socket_io.Server = null;

export function initialize(server: Server) {
    io = socket_io(server);
    io.on("connection", handleIncomingConnection);
}

function handleIncomingConnection(socket: socket_io.Socket) {
    // A new client is connected to data streaming
    // Send initial data
    console.log("> uno stronzo si è connesso");
}