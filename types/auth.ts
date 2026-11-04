export type UserRole = "donor" | "ngo" | "volunteer" | "admin";

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  organizationId?: string;
}
