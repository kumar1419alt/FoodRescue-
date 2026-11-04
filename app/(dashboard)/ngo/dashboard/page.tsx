import { DashboardShell } from "@/components/auth/dashboard-shell";
import { requireDashboardUser } from "@/lib/auth/authorization";
import { prisma } from "@/lib/data-access/prisma";

export default async function NgoDashboardPage() { const user = await requireDashboardUser("ngo"); const membership = await prisma.organizationMember.findFirst({ where: { userId: user.id, organization: { type: "ngo" } }, include: { organization: { include: { verification: true } } } }); return <DashboardShell membership={membership} user={user} />; }
