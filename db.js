import pkg from 'pg';
const { Pool } = pkg;  // Destructure Pool from the imported pg package
import dotenv from 'dotenv';  // Import dotenv for environment variable loading

dotenv.config();  // Load environment variables from .env file

// Create a new pool instance to manage multiple database connections
const pool = new Pool({
    host: process.env.DB_HOST,        // Database host (usually localhost or an IP)
    port: process.env.DB_PORT,        // Database port (default for PostgreSQL is 5432)
    user: process.env.DB_USER,        // Your database username
    password: process.env.DB_PASSWORD, // Your database password
    database: process.env.DB_NAME,     // The database name you're connecting to
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,  // Conditionally enable SSL
});

// Export the pool for use in other modules (like your server.js)
export default pool;
