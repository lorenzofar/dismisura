import dbClient from "./dbManager";
import { IncomingHttpHeaders } from "http2";

export interface Stats{
    totalConnections: number;
    dailyConnections: number;
    totalClicks: number;
    dailyClicks: number;
}

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
function getConnectionNumber(callback: (total: number, today: number, err: boolean) => void) {
    // get data about total number of connections and for daily quota
    dbClient("connection")
        .select(
            dbClient.raw("COUNT(CASE WHEN True THEN userid ELSE NULL END) AS total"),
            dbClient.raw("COUNT(CASE WHEN DATE_TRUNC('day', timestamp)=DATE_TRUNC('day', CURRENT_TIMESTAMP) THEN userid ELSE NULL END) AS today")
        )
        .then(data => {
            let totalConnections = data[0].total;
            let dailyConnections = data[0].today;
            callback(totalConnections, dailyConnections, false);
        })
        .catch((err) => {
            console.error(err);
            callback(0, 0, true);
        });
}

function getClicksNumber(callback: (total: number, today: number, err: boolean) => void) {
    dbClient("click")
        .select(
            dbClient.raw("COUNT(CASE WHEN True THEN userid ELSE NULL END) AS total"),
            dbClient.raw("COUNT(CASE WHEN DATE_TRUNC('day', timestamp)=DATE_TRUNC('day', CURRENT_TIMESTAMP) THEN userid ELSE NULL END) AS today")
        )
        .then(data => {
            let totalClicks = data[0].total;
            let dailyClicks = data[0].today;
            callback(totalClicks, dailyClicks, false);
        })
        .catch((err) => {
            console.error(err);
            callback(0, 0, true);
        });
}

export function getStats(callback: (stats: Stats)=>void){
    getConnectionNumber((totalConn, dailyConn) => {
        getClicksNumber((totalClicks, dailyClicks) => {
            let data: Stats = {
                totalConnections: totalConn,
                dailyConnections: dailyConn,
                totalClicks: totalClicks, 
                dailyClicks: dailyClicks
            }
            callback(data);
        }); 
    });
}