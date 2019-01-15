import { Server } from "http";
import * as socket_io from "socket.io";

import * as Analyzer from "./analyzer";

var io: socket_io.Server = null;

export function initialize(server: Server) {
    io = socket_io(server);
    io.on("connection", handleIncomingConnection);
}

function handleIncomingConnection(socket: socket_io.Socket) {
    Analyzer.trackUserConnection(socket.client.id);
}