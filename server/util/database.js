import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

// use this option for development environments
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

// use this option for production environments
// const sequelize = new Sequelize(process.env.DB_URL);

export default sequelize;
