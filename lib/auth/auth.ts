import "server-only";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { env } from "@/lib/config/env";
import { prisma } from "@/lib/data-access/prisma";
import { deliverAuthenticationEmail } from "@/lib/auth/email";

const isProduction = process.env.NODE_ENV === "production";

export const hasConfiguredAuthSecret = Boolean(
  env.BETTER_AUTH_SECRET ?? env.AUTH_SECRET,
);

export const auth = betterAuth({
  appName: "FoodRescue",
  baseURL: env.BETTER_AUTH_URL ?? env.APP_URL ?? "http://localhost:3000",
  // A build-only fallback lets Next.js statically inspect the route. The
  // route handler refuses all production traffic if a real secret is absent.
  secret:
    env.BETTER_AUTH_SECRET ??
    env.AUTH_SECRET ??
    "foodrescue-build-only-auth-secret-do-not-use-in-production",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    transaction: true,
  }),
  user: {
    modelName: "User",
    fields: {
      name: "displayName",
    },
  },
  session: {
    modelName: "AuthSession",
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  account: {
    modelName: "AuthAccount",
  },
  verification: {
    modelName: "AuthVerification",
    storeIdentifier: "hashed",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ url }) =>
      deliverAuthenticationEmail({
        subject: "Reset your FoodRescue password",
        url,
      }),
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ url }) =>
      deliverAuthenticationEmail({
        subject: "Verify your FoodRescue email",
        url,
      }),
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60 * 60, max: 5 },
      "/request-password-reset": { window: 60 * 60, max: 5 },
      "/send-verification-email": { window: 60 * 60, max: 5 },
    },
  },
  advanced: {
    database: {
      joins: true,
    },
    useSecureCookies: isProduction,
  },
  plugins: [nextCookies()],
});
