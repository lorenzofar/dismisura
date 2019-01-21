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