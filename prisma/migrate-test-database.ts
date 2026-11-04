import { spawnSync } from "node:child_process";

import { getTestDatabaseUrl } from "./test-database";

const databaseUrl = getTestDatabaseUrl();
const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, ["prisma", "migrate", "deploy"], {
  env: { ...process.env, DATABASE_URL: databaseUrl },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
