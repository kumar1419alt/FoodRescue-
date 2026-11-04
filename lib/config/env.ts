import { z } from "zod";

const serverEnvironmentSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  DATABASE_TEST_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  APP_URL: z.string().url().optional(),
});

/**
 * Future server configuration boundary. Values are optional until database and
 * authentication phases introduce the corresponding integrations.
 */
export const env = serverEnvironmentSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_TEST_URL: process.env.DATABASE_TEST_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  APP_URL: process.env.APP_URL,
});
