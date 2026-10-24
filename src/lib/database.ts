import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

export class DatabaseConfigurationError extends Error {
  constructor() {
    super("Database connection is not configured.");
    this.name = "DatabaseConfigurationError";
  }
}

let databaseClient: PrismaClient | undefined;

export function getDatabaseClient(): PrismaClient {
  if (databaseClient) {
    return databaseClient;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.includes("CHANGE_ME")) {
    throw new DatabaseConfigurationError();
  }

  databaseClient = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return databaseClient;
}
