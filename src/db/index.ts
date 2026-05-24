import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
    connectionString: config.connection_string
});

export const initDB = async () => {
    try {

        // Users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL,

                role VARCHAR(20)
                DEFAULT 'CONTRIBUTOR'
                CHECK(role IN ('CONTRIBUTOR','MAINTAINER')),

                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Issues table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS issues(
                id SERIAL PRIMARY KEY,

                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,

                type VARCHAR(20)
                NOT NULL
                CHECK (type IN ('Bug','Feature_Request')),

                status VARCHAR(20)
                DEFAULT 'Open'
                CHECK (status IN ('Open','In_Progress','Resolved')),

                reporter_id INTEGER
                REFERENCES users(id)
                ON DELETE CASCADE,

                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        console.log("Database connected and tables ready! Huurah!");

    } catch (err) {

        console.error("Error initializing database:", err);
        throw err;
    }
};