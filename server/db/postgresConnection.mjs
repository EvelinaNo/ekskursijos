import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432
});

export const connectDB = () => {
    return new Promise((resolve, reject) => {
        pool.connect((error) => {
            if (error) {
                console.log('connection error', error.stack);
                reject(error);
            } else {
                resolve('Database connected successfully');
            }
        });
    });
};
