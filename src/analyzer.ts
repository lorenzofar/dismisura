import dbClient from "./dbManager";

export function trackUserConnection(client: string) {
    if (!client || client == "") return;
    let connection: { userid: string } = {
        userid: client
    }
    dbClient("connection").insert(connection)
        .then(result => {
        })
        .catch(err => {
            console.error(err);
        });
}

export function trackUserClick(client: string){
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