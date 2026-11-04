function normalizeConnectionString(connectionString: string) {
  const url = new URL(connectionString);
  url.username = "";
  url.password = "";
  return url.toString();
}

export function getTestDatabaseUrl() {
  const connectionString = process.env.DATABASE_TEST_URL;

  if (!connectionString) {
    throw new Error("DATABASE_TEST_URL is required for database integration tests.");
  }

  const url = new URL(connectionString);
  const databaseName = decodeURIComponent(url.pathname.replace(/^\//, ""));

  if (!databaseName.endsWith("_test")) {
    throw new Error("DATABASE_TEST_URL must point to a database whose name ends in _test.");
  }

  const developmentUrl = process.env.DATABASE_URL;

  if (developmentUrl && normalizeConnectionString(developmentUrl) === normalizeConnectionString(connectionString)) {
    throw new Error("DATABASE_TEST_URL must not be the same database as DATABASE_URL.");
  }

  return connectionString;
}
