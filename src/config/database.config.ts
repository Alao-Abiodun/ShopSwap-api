import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

export const DBClient = () => {
  return new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
  });
}

    
