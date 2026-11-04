import { getTestDatabaseUrl } from "@/prisma/test-database";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("test database guard", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("requires a dedicated database name ending in _test", () => {
    vi.stubEnv("DATABASE_TEST_URL", "postgresql://user@localhost:5432/foodrescue_dev");

    expect(() => getTestDatabaseUrl()).toThrow("ends in _test");
  });

  it("rejects a test URL that targets the same database as the development URL", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://development@localhost:5432/foodrescue_test");
    vi.stubEnv("DATABASE_TEST_URL", "postgresql://test@localhost:5432/foodrescue_test");

    expect(() => getTestDatabaseUrl()).toThrow("must not be the same database");
  });

  it("accepts a distinct database whose name ends in _test", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user@localhost:5432/foodrescue_dev");
    vi.stubEnv("DATABASE_TEST_URL", "postgresql://user@localhost:5432/foodrescue_test");

    expect(getTestDatabaseUrl()).toContain("foodrescue_test");
  });
});
