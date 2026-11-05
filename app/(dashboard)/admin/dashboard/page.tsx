import { DashboardShell } from "@/components/auth/dashboard-shell";
import { requireDashboardUser } from "@/lib/auth/authorization";

export default async function AdminDashboardPage() { return <DashboardShell user={await requireDashboardUser("admin")} />; }
