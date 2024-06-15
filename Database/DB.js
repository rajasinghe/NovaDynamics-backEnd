import mysql from "mysql2/promise.js";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: "",
  database: process.env.DB_NAME,
});

export default pool;
