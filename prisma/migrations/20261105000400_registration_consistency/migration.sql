-- Phase 4 registration hardening. Staged registration intents bind the
-- application role setup to the framework user-create lifecycle.

CREATE TABLE "RegistrationIntent" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" "UserRole" NOT NULL,
  "organizationName" TEXT,
  "nonceHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ(6) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RegistrationIntent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RegistrationIntent_email_key" ON "RegistrationIntent"("email");
CREATE UNIQUE INDEX "RegistrationIntent_nonceHash_key" ON "RegistrationIntent"("nonceHash");
CREATE INDEX "RegistrationIntent_expiresAt_idx" ON "RegistrationIntent"("expiresAt");
