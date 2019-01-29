import { Server } from "http";
import * as socket_io from "socket.io";

import * as Analyzer from "./analyzer";

var io: socket_io.Server;

export function initialize(server: Server) {
    io = socket_io(server);
    io.on("connection", handleIncomingConnection);
}

function handleIncomingConnection(socket: socket_io.Socket) {
    let clientId = socket.client.id;
    let clientIP = socket.handshake.address;
    Analyzer.trackUserConnection(clientId, clientIP);
    io.emit("userconnected", Object.keys(io.clients().connected).length);
    socket.on("disconnect", Analyzer.trackUserDisconnection.bind(null, clientId));
    socket.on("click", () => {
        Analyzer.trackUserClick(clientId);
        Analyzer.getClicksNumber((totalClicks, dailyClicks) => {
            io.emit("click", { totalClicks, dailyClicks });
        });
    });
}