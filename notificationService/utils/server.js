import "dotenv/config";
import fastify from "fastify";
import postgres from "@fastify/postgres";

export function createServer() {
  const app = fastify({
    logger: true,
  });

  const {
    POSTGRESQL_HOST,
    POSTGRESQL_USER,
    POSTGRESQL_DATABASE,
    POSTGRESQL_PASSWORD,
    POSTGRESQL_PORT,
  } = process.env;
  const connectionString = `postgresql://${POSTGRESQL_USER}:${POSTGRESQL_PASSWORD}@${POSTGRESQL_HOST}:${POSTGRESQL_PORT}/${POSTGRESQL_DATABASE}`;

  app.register(postgres, { connectionString });
  return app;
}
