import { DashboardShell } from "@/components/auth/dashboard-shell";
import { requireActiveUser } from "@/lib/auth/authorization";

export default async function ProfilePage() { return <DashboardShell user={await requireActiveUser()}><p className="mt-3 text-sm text-muted-foreground">Profile editing will be introduced with organization onboarding. Your identity is shown from the authenticated database record.</p></DashboardShell>; }
