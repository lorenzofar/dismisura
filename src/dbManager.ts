import * as knex from "knex";

const config = {
    client: 'pg',
    connection: process.env.DATABASE_URL
}

const dbClient = knex(config);
export default dbClient;