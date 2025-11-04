import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const isProd = process.env.NODE_ENV === "production";
const hasDatabaseUrl = !!process.env.DATABASE_URL;
const syncOverride =
  String(process.env.DB_SYNCHRONIZE || "").toLowerCase() === "true";

export const databaseConfig: TypeOrmModuleOptions = hasDatabaseUrl
  ? {
      type: "postgres",
      url: process.env.DATABASE_URL as string,
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      synchronize: syncOverride ? true : !isProd,
      logging: !isProd ? process.env.NODE_ENV === "development" : false,
      ssl: isProd ? { rejectUnauthorized: false } : false,
      extra: isProd
        ? {
            // Some providers require ssl in extra for pg driver
            ssl: { rejectUnauthorized: false },
            max: parseInt(process.env.DB_MAX_CONNECTIONS || "20"),
            connectionTimeoutMillis: parseInt(
              process.env.DB_CONNECTION_TIMEOUT || "60000"
            ),
          }
        : {
            max: parseInt(process.env.DB_MAX_CONNECTIONS || "20"),
            connectionTimeoutMillis: parseInt(
              process.env.DB_CONNECTION_TIMEOUT || "60000"
            ),
          },
    }
  : {
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_DATABASE || "user_registration",
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      synchronize: syncOverride ? true : !isProd, // Auto-create tables in development (can be overridden)
      logging: process.env.NODE_ENV === "development",
      ssl: isProd ? { rejectUnauthorized: false } : false,
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
