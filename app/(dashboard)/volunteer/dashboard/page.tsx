import { DashboardShell } from "@/components/auth/dashboard-shell";
import { requireDashboardUser } from "@/lib/auth/authorization";

export default async function VolunteerDashboardPage() { return <DashboardShell user={await requireDashboardUser("volunteer")} />; }
