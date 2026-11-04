import { describe, expect, it } from "vitest";

import { safeRedirectPath } from "@/lib/auth/redirect";
import { dashboardByRole, isPublicRegistrationRole } from "@/lib/auth/roles";
import { registrationSchema } from "@/lib/validations/auth";

describe("authentication validation", () => {
  it("normalizes a valid public registration", () => {
    const result = registrationSchema.parse({
      displayName: "Asha Sharma",
      email: "ASHA@Example.Test ",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      role: "ngo",
      organizationName: "Community Kitchen",
    });

    expect(result.email).toBe("asha@example.test");
    expect(result.role).toBe("ngo");
  });

  it("rejects weak passwords and privileged public registration", () => {
    expect(
      registrationSchema.safeParse({
        displayName: "Asha Sharma",
        email: "asha@example.test",
        password: "weakpassword",
        confirmPassword: "weakpassword",
        role: "admin",
      }).success,
    ).toBe(false);
    expect(isPublicRegistrationRole("admin")).toBe(false);
  });

  it("allows only safe local callback paths", () => {
    expect(safeRedirectPath("/donor/dashboard?tab=open")).toBe("/donor/dashboard?tab=open");
    expect(safeRedirectPath("https://attacker.example")).toBe("/dashboard");
    expect(safeRedirectPath("//attacker.example")).toBe("/dashboard");
  });

  it("maps each global role to its own dashboard", () => {
    expect(dashboardByRole).toEqual({
      donor: "/donor/dashboard",
      ngo: "/ngo/dashboard",
      volunteer: "/volunteer/dashboard",
      admin: "/admin/dashboard",
    });
  });
});
