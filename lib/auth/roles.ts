import type { UserRole } from "@/generated/prisma/client";

export const publicRegistrationRoles = ["donor", "ngo", "volunteer"] as const;
export type PublicRegistrationRole = (typeof publicRegistrationRoles)[number];

export const dashboardByRole: Record<UserRole, string> = {
  donor: "/donor/dashboard",
  ngo: "/ngo/dashboard",
  volunteer: "/volunteer/dashboard",
  admin: "/admin/dashboard",
};

export function isPublicRegistrationRole(role: string): role is PublicRegistrationRole {
  return publicRegistrationRoles.includes(role as PublicRegistrationRole);
}
