import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "user_registration",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: process.env.NODE_ENV !== "production", // Auto-create tables in development
  logging: process.env.NODE_ENV === "development",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  // Connection pool configuration
  extra: {
    max: parseInt(process.env.DB_MAX_CONNECTIONS || "20"),
    connectionTimeoutMillis: parseInt(
      process.env.DB_CONNECTION_TIMEOUT || "60000"
    ),
  },
};

export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "user_registration_test",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: true, // Always sync for tests
  logging: false, // Disable logging for tests
  dropSchema: true, // Drop schema between tests
  // Connection pool configuration for tests
  extra: {
    max: 5, // Smaller pool for tests
    connectionTimeoutMillis: 30000,
  },
};
