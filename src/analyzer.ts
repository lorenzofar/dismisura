import dbClient from "./dbManager";
import { IncomingHttpHeaders } from "http2";

export function trackUserConnection(client: string, ip: string) {
    if (!client || client == "") return;
    let connection: { userid: string, ip: string } = {
        userid: client,
        ip: ip
    }
    dbClient("connection").insert(connection)
        .then(result => {
        })
        .catch(err => {
            console.error(err);
        });
}

export function trackUserClick(client: string) {
    if (!client || client == "") return;
    let click: { userid: string } = {
        userid: client
    }
    dbClient("click").insert(click)
        .then(result => {
        })
        .catch(err => {
            console.error(err);
        });
}

/* ===== CONNECTIONS STATS ===== */
export function getConnectionNumber(callback: (count: number, err: boolean) => void) {
    dbClient("connection").count()
        .then(data => {
            let connectionsCount = data[0].count;
            callback(connectionsCount, false);
        })
        .catch((err) => {
            console.error(err);
            callback(0, true);
        });
}