import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

// Optimized pool configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  // Connection pool optimization
  max: 20, // Maximum number of clients in the pool
  min: 4, // Minimum number of idle clients maintained in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client

  // Query execution timeout
  statement_timeout: 10000, // Abort any statement that takes more than 10 seconds

  // Keeping connections alive
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Add event listeners for pool monitoring
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

pool.on("connect", () => {
  // Optional: run setup queries or set session parameters
  // client.query('SET SESSION idle_in_transaction_session_timeout = 60000');
});

export default pool;
