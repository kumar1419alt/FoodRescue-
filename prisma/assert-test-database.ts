const connectionString = process.env.DATABASE_TEST_URL;

if (!connectionString) {
  throw new Error("DATABASE_TEST_URL is required for database integration tests.");
}

const databaseName = new URL(connectionString).pathname.replace(/^\//, "");

if (!databaseName.endsWith("_test")) {
  throw new Error("DATABASE_TEST_URL must point to a database whose name ends in _test.");
}
