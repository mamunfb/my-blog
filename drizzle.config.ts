import { defineConfig } from "drizzle-kit";

// A local placeholder lets schema generation work without credentials. Migration
// commands should always be run with DATABASE_URL set to the target PostgreSQL DB.
const connectionString = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/postgres";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle-postgres",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
