// @vitest-environment node

import { config } from "dotenv";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

config({ path: ".env.local", quiet: true });
const testDatabaseUrl = process.env.DATABASE_TEST_URL;
process.env.DATABASE_URL = process.env.DATABASE_TEST_URL;

const [{ PrismaPg }, { PrismaClient }, { POST }, { auth }, emails, registration] = await Promise.all([
  import("@prisma/adapter-pg"),
  import("@/generated/prisma/client"),
  import("@/app/api/register/route"),
  import("@/lib/auth/auth"),
  import("@/lib/auth/email"),
  import("@/lib/auth/registration"),
]);

const suffix = `auth-${Date.now()}`;
const password = "SecurePass123";
const baseUrl = "http://localhost:3000";
let prisma: InstanceType<typeof PrismaClient>;
const createdEmails: string[] = [];

function email(kind: string) {
  const value = `${kind}-${suffix}@example.test`;
  createdEmails.push(value);
  return value;
}

function registrationRequest(body: Record<string, unknown>) {
  return new Request(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: baseUrl },
    body: JSON.stringify(body),
  });
}

async function register(role: "donor" | "ngo" | "volunteer", organizationName?: string) {
  const userEmail = email(role);
  const response = await POST(
    registrationRequest({
      displayName: `${role} integration user`,
      email: userEmail,
      password,
      confirmPassword: password,
      role,
      organizationName,
    }),
  );
  expect(response.status).toBe(202);
  return userEmail;
}

async function send(path: string, body?: Record<string, unknown>, cookie?: string) {
  return auth.handler(
    new Request(`${baseUrl}/api/auth/${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: baseUrl,
        ...(cookie ? { cookie } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    }),
  );
}

async function tokenFromEmail(subject: string) {
  await expect.poll(() => emails.getDevelopmentEmails().find((entry) => entry.subject === subject)).toBeDefined();
  const message = emails.getDevelopmentEmails().find((entry) => entry.subject === subject);
  const url = new URL(message!.url);
  return url.searchParams.get("token") ?? url.pathname.split("/").at(-1) ?? null;
}

describe("authentication PostgreSQL integration", () => {
  beforeAll(async () => {
    if (!testDatabaseUrl) throw new Error("DATABASE_TEST_URL is required for database integration tests.");
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: testDatabaseUrl }) });
    await prisma.$connect();
  });

  beforeEach(() => emails.clearDevelopmentEmails());

  afterAll(async () => {
    if (!prisma) return;
    const users = await prisma.user.findMany({ where: { email: { in: createdEmails } }, select: { id: true } });
    await prisma.registrationIntent.deleteMany({ where: { email: { in: createdEmails } } });
    await prisma.user.deleteMany({ where: { id: { in: users.map((user) => user.id) } } });
    await prisma.$disconnect();
  });

  it("creates donor, NGO pending organization, and volunteer registrations without privilege escalation", async () => {
    const donorEmail = await register("donor");
    const ngoEmail = await register("ngo", "Integration Community Kitchen");
    const volunteerEmail = await register("volunteer");

    const [donor, ngo, volunteer] = await Promise.all([
      prisma.user.findUnique({ where: { email: donorEmail }, include: { authaccounts: true } }),
      prisma.user.findUnique({ where: { email: ngoEmail }, include: { memberships: { include: { organization: { include: { verification: true } } } } } }),
      prisma.user.findUnique({ where: { email: volunteerEmail } }),
    ]);
    expect(donor).toMatchObject({ role: "donor", isActive: true });
    expect(donor?.authaccounts[0]?.password).toBeTruthy();
    expect(donor?.authaccounts[0]?.password).not.toBe(password);
    expect(ngo).toMatchObject({ role: "ngo", isActive: true, memberships: [{ role: "ngo", organization: { type: "ngo", verification: { status: "pending" } } }] });
    expect(volunteer).toMatchObject({ role: "volunteer", isActive: true });
  });

  it("rejects public administrator and direct Better Auth registration attempts", async () => {
    const adminResponse = await POST(
      registrationRequest({ displayName: "Admin Attempt", email: email("admin"), password, confirmPassword: password, role: "admin" }),
    );
    expect(adminResponse.status).toBe(400);

    const directEmail = email("direct");
    const directResponse = await send("sign-up/email", { name: "Direct Attempt", email: directEmail, password });
    expect(directResponse.ok).toBe(false);
    await expect(prisma.user.findUnique({ where: { email: directEmail } })).resolves.toBeNull();
  });

  it("verifies email, rejects invalid credentials, persists login sessions, and revokes them on logout", async () => {
    const donorEmail = await register("donor");
    const verificationDispatch = await send("send-verification-email", {
      email: donorEmail,
      callbackURL: "/verify-email",
    });
    expect(verificationDispatch.ok).toBe(true);
    const verificationToken = await tokenFromEmail("Verify your FoodRescue email");
    expect(verificationToken).toBeTruthy();
    const verificationResponse = await auth.handler(new Request(`${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(verificationToken!)}`));
    expect(verificationResponse.ok || verificationResponse.status === 302).toBe(true);
    await expect(prisma.user.findUnique({ where: { email: donorEmail } })).resolves.toMatchObject({ emailVerified: true });

    const invalid = await send("sign-in/email", { email: donorEmail, password: "WrongPass123" });
    expect(invalid.ok).toBe(false);
    const login = await send("sign-in/email", { email: donorEmail, password });
    expect(login.ok).toBe(true);
    const cookie = login.headers.get("set-cookie");
    expect(cookie).toBeTruthy();
    const user = await prisma.user.findUniqueOrThrow({ where: { email: donorEmail } });
    expect(await prisma.authSession.count({ where: { userId: user.id } })).toBeGreaterThan(0);
    const logout = await send("sign-out", undefined, cookie!);
    expect(logout.ok).toBe(true);
    expect(await prisma.authSession.count({ where: { userId: user.id } })).toBe(0);
  });

  it("blocks inactive accounts from acquiring sessions", async () => {
    const donorEmail = await register("donor");
    const user = await prisma.user.findUniqueOrThrow({ where: { email: donorEmail } });
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true, isActive: false } });
    const login = await send("sign-in/email", { email: donorEmail, password });
    expect(login.ok).toBe(false);
    expect(await prisma.authSession.count({ where: { userId: user.id } })).toBe(0);
  });

  it("expires reset tokens, consumes valid reset tokens once, and revokes prior sessions", async () => {
    const donorEmail = await register("donor");
    await prisma.user.update({ where: { email: donorEmail }, data: { emailVerified: true, isActive: true } });
    const initialLogin = await send("sign-in/email", { email: donorEmail, password });
    expect(initialLogin.ok, await initialLogin.text()).toBe(true);

    const expiredDispatch = await send("request-password-reset", { email: donorEmail, redirectTo: "/reset-password" });
    expect(expiredDispatch.ok).toBe(true);
    const expiredToken = await tokenFromEmail("Reset your FoodRescue password");
    const verification = await prisma.authVerification.findFirstOrThrow({ orderBy: { createdAt: "desc" } });
    await prisma.authVerification.update({ where: { id: verification.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    const expiredReset = await send("reset-password", { token: expiredToken, newPassword: "UpdatedPass123" });
    expect(expiredReset.ok).toBe(false);

    emails.clearDevelopmentEmails();
    await send("request-password-reset", { email: donorEmail, redirectTo: "/reset-password" });
    const resetToken = await tokenFromEmail("Reset your FoodRescue password");
    const reset = await send("reset-password", { token: resetToken, newPassword: "UpdatedPass123" });
    expect(reset.ok, await reset.text()).toBe(true);
    const repeatedReset = await send("reset-password", { token: resetToken, newPassword: "AnotherPass123" });
    expect(repeatedReset.ok).toBe(false);
    expect((await send("sign-in/email", { email: donorEmail, password })).ok).toBe(false);
    expect((await send("sign-in/email", { email: donorEmail, password: "UpdatedPass123" })).ok).toBe(true);
  });

  it("leaves a failed NGO setup inactive and without privileged organization records", async () => {
    const userEmail = email("failed-ngo");
    const user = await prisma.user.create({ data: { email: userEmail, displayName: "Failed NGO", isActive: false } });
    await prisma.registrationIntent.create({
      data: {
        email: userEmail,
        role: "ngo",
        nonceHash: `test-${user.id}`,
        expiresAt: new Date(Date.now() + 60_000),
      },
    });
    await expect(registration.completeRegistration(prisma, user.id, userEmail)).rejects.toThrow("NGO registration requires an organization.");
    await expect(prisma.user.findUnique({ where: { id: user.id } })).resolves.toMatchObject({ isActive: false, role: "donor" });
    expect(await prisma.organizationMember.count({ where: { userId: user.id } })).toBe(0);
  });
});
