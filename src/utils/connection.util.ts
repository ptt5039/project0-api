import { Pool } from 'pg';

const connectionConfiguration = {
    user: process.env.EXPENSE_DB_USERNAME,
    host: process.env.EXPENSE_DB_URL,
    database: process.env.EXPENSE_DB_NAME,
    password: process.env.EXPENSE_DB_PASSWORD,
    port: +process.env.EXPENSE_DB_PORT,
    max: 5
};

// console.log(connectionConfiguration);

export const connectionPool = new Pool(connectionConfiguration);