// prisma.config.ts
import { defineConfig } from "@prisma/cli";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env.local" });

export default defineConfig({
  datasources: {
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL!, // non-null assertion
    },
  },
  generators: {
    client: {
      provider: "prisma-client-js",
      output: "../src/generated/prisma",
    },
  },
});
