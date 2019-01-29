import dbClient from "./dbManager";
import { IncomingHttpHeaders } from "http2";

export interface Stats {
    totalConnections: number;
    dailyConnections: number;
    totalTime: number;
    totalClicks: number;
    dailyClicks: number;
}

interface TimeTracker {
    [client: string]: number;
}

var time: TimeTracker = {};

export function trackUserConnection(client: string, ip: string) {
    if (!client || client == "") return;
    let connection: { userid: string, ip: string } = {
        userid: client,
        ip: ip
    }
    dbClient("connection").insert(connection)
        .then(result => {
            time[client] = 0;
        })
        .catch(err => {
            console.error(err);
        });
}

export function trackUserDisconnection(client: string) {
    if (!client || client == "" || !(client in time)) return;
    console.log(`${client} disconnected`);
    dbClient("connection")
        .where({ userid: client }).
        update({ time: time[client] })
        .then(() => {
        })
        .catch(err => {
            console.error(err);
        })
        .finally(() => {
            delete time[client];
        })
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
function getConnectionNumber(callback: (total: number, today: number, time: number,  err: boolean) => void) {
    // get data about total number of connections and for daily quota
    dbClient("connection")
        .select(            
            dbClient.raw("SUM(time) AS totalTime"),
            dbClient.raw("COUNT(CASE WHEN True THEN userid ELSE NULL END) AS total"),
            dbClient.raw("COUNT(CASE WHEN DATE_TRUNC('day', timestamp)=DATE_TRUNC('day', CURRENT_TIMESTAMP) THEN userid ELSE NULL END) AS today")
        )
        .then(data => {
            let totalConnections = data[0].total;
            let dailyConnections = data[0].today;
            let totalTime = data[0].totaltime;
            callback(totalConnections, dailyConnections, totalTime, false);
        })
        .catch((err) => {
            console.error(err);
            callback(0, 0, 0, true);
        });
}

export function getClicksNumber(callback: (total: number, today: number, err: boolean) => void) {
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

export function getStats(callback: (stats: Stats) => void) {
    getConnectionNumber((totalConn, dailyConn, totalTime) => {
        getClicksNumber((totalClicks, dailyClicks) => {
            let data: Stats = {
                totalConnections: totalConn,
                dailyConnections: dailyConn,
                totalTime: totalTime,
                totalClicks: totalClicks,
                dailyClicks: dailyClicks
            }
            callback(data);
        });
    });
}

function trackerTick() {
    Object.keys(time).forEach(client => time[client]++);
}

setInterval(trackerTick, 1000);