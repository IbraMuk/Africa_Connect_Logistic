const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";
const useSsl = process.env.DB_SSL === "true" || isProduction;

const commonOptions = {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: useSsl ? { require: true, rejectUnauthorized: false } : false,
  },
  define: {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: false,
    freezeTableName: true,
  },
};

let sequelize;

if (process.env.DATABASE_URL) {
  // Use full connection string (Supabase, Render managed PostgreSQL, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL, commonOptions);
} else {
  // Use individual connection parameters
  sequelize = new Sequelize(
    process.env.DB_NAME || "africa_connect_logistic",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "",
    {
      ...commonOptions,
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5432,
    }
  );
}

module.exports = { sequelize };
