const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const useSsl = process.env.DB_SSL === 'true' || isProduction;

let poolConfig;

if (process.env.DATABASE_URL) {
  // Use full connection string (Supabase, Render managed PostgreSQL, etc.)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
  };
} else {
  // Use individual connection parameters
  poolConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'africa_connect_logistic',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
  };
}

poolConfig.ssl = useSsl ? { rejectUnauthorized: false } : false;

const pool = new Pool(poolConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
