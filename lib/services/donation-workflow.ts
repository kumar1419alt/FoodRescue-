import "server-only";

/**
 * Future donation commands belong here. Multi-record lifecycle updates must use
 * Prisma transactions and enforce authorization in the calling server boundary.
 */
export const donationWorkflow = {
  transactionPolicy: "Use a transaction for status changes and their custody/audit records.",
} as const;
