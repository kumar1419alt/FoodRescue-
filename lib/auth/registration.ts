import "server-only";

import { createHash, randomBytes } from "node:crypto";

import type { PrismaClient, UserRole } from "@/generated/prisma/client";
import { isPublicRegistrationRole } from "@/lib/auth/roles";

const registrationLifetimeMs = 10 * 60 * 1000;

function hashNonce(nonce: string) {
  return createHash("sha256").update(nonce).digest("hex");
}

function createNgoSlug(name: string, userId: string) {
  const normalized = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${normalized || "ngo"}-${userId.slice(-8)}`;
}

export async function createRegistrationIntent(
  prisma: PrismaClient,
  input: { email: string; role: UserRole; organizationName?: string },
) {
  if (!isPublicRegistrationRole(input.role)) {
    throw new Error("Public registration role is not allowed.");
  }

  const nonce = randomBytes(32).toString("base64url");
  const now = new Date();
  await prisma.registrationIntent.deleteMany({ where: { expiresAt: { lt: now } } });
  await prisma.registrationIntent.create({
    data: {
      email: input.email,
      role: input.role,
      organizationName: input.organizationName,
      nonceHash: hashNonce(nonce),
      expiresAt: new Date(now.getTime() + registrationLifetimeMs),
    },
  });
  return nonce;
}

export async function assertRegistrationIntent(
  prisma: PrismaClient,
  email: string,
  nonce: string | null,
) {
  if (!nonce) return false;
  const intent = await prisma.registrationIntent.findFirst({
    where: { email, nonceHash: hashNonce(nonce), expiresAt: { gt: new Date() } },
  });
  return Boolean(intent);
}

export async function completeRegistration(prisma: PrismaClient, userId: string, email: string) {
  const intent = await prisma.registrationIntent.findFirst({
    where: { email, expiresAt: { gt: new Date() } },
  });
  if (!intent || !isPublicRegistrationRole(intent.role)) {
    throw new Error("Registration setup could not be completed.");
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.user.update({
      where: { id: userId },
      data: { role: intent.role, isActive: true },
    });
    if (intent.role === "ngo") {
      if (!intent.organizationName) throw new Error("NGO registration requires an organization.");
      const organization = await transaction.organization.create({
        data: {
          name: intent.organizationName,
          slug: createNgoSlug(intent.organizationName, userId),
          type: "ngo",
          contactEmail: email,
          members: { create: { userId, role: "ngo" } },
          verification: { create: { status: "pending" } },
        },
      });
      await transaction.auditLog.create({
        data: {
          actorUserId: userId,
          entityType: "Organization",
          entityId: organization.id,
          action: "auth.ngo.organization.created",
          metadata: { verificationStatus: "pending" },
        },
      });
    }
    await transaction.auditLog.create({
      data: {
        actorUserId: userId,
        entityType: "User",
        entityId: userId,
        action: "auth.registration.created",
        metadata: { role: intent.role, organizationCreated: intent.role === "ngo" },
      },
    });
    await transaction.registrationIntent.delete({ where: { id: intent.id } });
  });
}
