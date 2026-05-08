// File: src/config/data-source.ts
// I did not use this, it is just for testing the connection to the database. I will delete it later.
// RATHER DB CONNECTED THROUGH app.module.ts, I JUST WANTED TO TEST THE CONNECTION FIRST. I WILL DELETE THIS FILE LATER.


import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file
const AppDataSource = new DataSource({
  type: "postgres", // Define database type
  url: process.env.DATABASE_URL, // Load database URL from environment variables
  synchronize: true, // Set to false in production
  logging: true, // Enable query logging for debugging
  ssl: process.env.NODE_ENV === 'production'
  ? { rejectUnauthorized: false }
  : false,
  entities: [__dirname + '/../**/*.entity.{ts,js}'], // Path to entities
  migrations: [__dirname + '/../migrations/*.{ts,js}'], // Path to migrations
  subscribers: [__dirname + '/../subscriber/**/*.ts'], // Path to subscribers
});
export default AppDataSource;