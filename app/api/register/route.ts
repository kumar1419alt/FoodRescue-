import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { isPublicRegistrationRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/data-access/prisma";
import { registrationSchema } from "@/lib/validations/auth";

const genericResponse = {
  message: "If this email can be registered, check your inbox to verify your account.",
};

export async function POST(request: Request) {
  const expectedOrigin = new URL(request.url).origin;
  const requestOrigin = request.headers.get("origin");
  if (requestOrigin && requestOrigin !== expectedOrigin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const json: unknown = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(json);
  if (!parsed.success || !isPublicRegistrationRole(parsed.data.role)) {
    return NextResponse.json({ error: "Please review the registration details." }, { status: 400 });
  }

  const { displayName, email, password, role, organizationName } = parsed.data;
  if (role === "ngo" && !organizationName) {
    return NextResponse.json({ error: "Enter your NGO name." }, { status: 400 });
  }
  const authRequest = new Request(new URL("/api/auth/sign-up/email", request.url), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: new URL(request.url).origin,
    },
    body: JSON.stringify({
      name: displayName,
      email,
      password,
      callbackURL: "/verify-email",
    }),
  });

  const response = await auth.handler(authRequest);
  if (!response.ok) {
    // The framework returns generic duplicate responses with verification
    // enabled. Preserve that account-enumeration protection for this route.
    return NextResponse.json(genericResponse, { status: 202 });
  }

  const payload = (await response.json()) as { user?: { id?: string } };
  const userId = payload.user?.id;
  if (userId) {
    await prisma.$transaction(async (transaction) => {
      await transaction.user.update({
        where: { id: userId },
        data: { role },
      });
      if (role === "ngo" && organizationName) {
        const organization = await transaction.organization.create({
          data: {
            name: organizationName,
            slug: `${organizationName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${userId.slice(-8)}`,
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
          metadata: { role, organizationCreated: role === "ngo" },
        },
      });
    });
  }

  return NextResponse.json(genericResponse, { status: 202 });
}
