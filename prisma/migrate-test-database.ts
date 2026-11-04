import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

import { getTestDatabaseUrl } from "./test-database";

const databaseUrl = getTestDatabaseUrl();
const require = createRequire(import.meta.url);
const prismaCli = require.resolve("prisma/build/index.js");
const result = spawnSync(process.execPath, [prismaCli, "migrate", "deploy"], {
  env: { ...process.env, DATABASE_URL: databaseUrl },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
