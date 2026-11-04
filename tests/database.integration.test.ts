import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const databaseUrl = process.env.DATABASE_TEST_URL;

describe.skipIf(!databaseUrl)("PostgreSQL integration", () => {
  const client = databaseUrl ? new Client({ connectionString: databaseUrl }) : undefined;

  beforeAll(() => {
    if (!databaseUrl) {
      throw new Error("DATABASE_TEST_URL is required for database integration tests.");
    }
  });

  beforeAll(async () => {
    await client!.connect();
  });

  afterAll(async () => {
    await client?.end();
  });

  it("connects only to an explicitly named test database", async () => {
    expect(new URL(databaseUrl!).pathname).toMatch(/_test$/);
    await expect(client!.query("SELECT 1 AS healthy")).resolves.toMatchObject({ rows: [{ healthy: 1 }] });
  });

  it("has the Prisma migration table after migrations are applied", async () => {
    const result = await client!.query<{ exists: boolean }>(
      "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_prisma_migrations') AS exists",
    );
    expect(result.rows[0]?.exists).toBe(true);
  });
});
