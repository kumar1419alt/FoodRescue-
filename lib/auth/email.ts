import "server-only";

/**
 * Production mail delivery remains intentionally unconfigured until a provider
 * is supplied. An explicit local console transport may be enabled for manual
 * testing; it is never enabled in production.
 */
export async function deliverAuthenticationEmail({
  subject,
  url,
}: {
  subject: string;
  url: string;
}) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Authentication email delivery is not configured.");
  }

  if (process.env.FOODRESCUE_DEV_EMAIL_TRANSPORT === "console") {
    // Explicit opt-in only. Do not enable this transport in production.
    console.info(`[FoodRescue development email] ${subject}: ${url}`);
    return;
  }

  // Do not log or persist raw tokens when no safe local transport is enabled.
  console.info(`[FoodRescue development email] ${subject} queued without a configured transport.`);
}
