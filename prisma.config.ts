import "dotenv/config";
import { defineConfig } from "prisma/config";

// Quick validation to see exactly what Prisma is reading
if (!process.env.DATABASE_URL) {
  console.warn("⚠️ Warning: DATABASE_URL is not defined in your environment variables!");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});