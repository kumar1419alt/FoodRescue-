import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { UserRole } from "@/generated/prisma/client";
import { auth } from "@/lib/auth/auth";
import { dashboardByRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/data-access/prisma";

export class AuthorizationError extends Error {
  constructor(message: "UNAUTHENTICATED" | "FORBIDDEN" | "INACTIVE") {
    super(message);
  }
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, displayName: true, email: true, role: true, isActive: true, emailVerified: true },
  });
}

export async function requireActiveUser() {
  const user = await getCurrentUser();
  if (!user) throw new AuthorizationError("UNAUTHENTICATED");
  if (!user.isActive) throw new AuthorizationError("INACTIVE");
  return user;
}

export async function requireGlobalRole(...roles: UserRole[]) {
  const user = await requireActiveUser();
  if (!roles.includes(user.role)) throw new AuthorizationError("FORBIDDEN");
  return user;
}

export async function requirePlatformAdmin() {
  return requireGlobalRole("admin");
}

export async function requireOrganizationMembership(organizationId: string, allowedRoles?: UserRole[]) {
  const user = await requireActiveUser();
  const membership = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId, userId: user.id } },
  });
  if (!membership || (allowedRoles && !allowedRoles.includes(membership.role))) {
    throw new AuthorizationError("FORBIDDEN");
  }
  return { user, membership };
}

export async function requireVerifiedNgo(organizationId: string) {
  const { user, membership } = await requireOrganizationMembership(organizationId, ["ngo"]);
  const verification = await prisma.verification.findUnique({
    where: { organizationId },
    select: { status: true },
  });
  if (verification?.status !== "approved") throw new AuthorizationError("FORBIDDEN");
  return { user, membership, verification };
}

export async function requireDashboardUser(expectedRole?: UserRole) {
  const user = await requireActiveUser();
  if (expectedRole && user.role !== expectedRole) redirect(dashboardByRole[user.role]);
  return user;
}
