import { DashboardShell } from "@/components/auth/dashboard-shell";
import { requireDashboardUser } from "@/lib/auth/authorization";
import { prisma } from "@/lib/data-access/prisma";

export default async function DonorDashboardPage() { const user = await requireDashboardUser("donor"); const membership = await prisma.organizationMember.findFirst({ where: { userId: user.id, organization: { type: { in: ["restaurant", "hotel", "event_organizer", "marriage_hall", "household"] } } }, include: { organization: { include: { verification: true } } } }); return <DashboardShell membership={membership} user={user} />; }
