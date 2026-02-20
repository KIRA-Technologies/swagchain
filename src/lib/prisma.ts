import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const rawConnectionString = process.env.DATABASE_URL;
  let connectionString = rawConnectionString;

  if (rawConnectionString) {
    try {
      const url = new URL(rawConnectionString);
      // pg-connection-string >= v2 treats sslmode aliases more strictly.
      // Keep libpq-compatible behavior for managed providers like Supabase pooler.
      if (
        url.searchParams.get("sslmode") === "require" &&
        !url.searchParams.has("uselibpqcompat")
      ) {
        url.searchParams.set("uselibpqcompat", "true");
      }
      connectionString = url.toString();
    } catch {
      // Keep the original string if URL parsing fails.
      connectionString = rawConnectionString;
    }
  }

  const isSupabase = connectionString?.includes(".supabase.co");

  const pool = new pg.Pool({
    connectionString,
    // Supabase requires TLS from Vercel/serverless environments.
    ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
