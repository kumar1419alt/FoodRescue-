import { DashboardShell } from "@/components/auth/dashboard-shell";
import { PasswordChangeForm } from "@/components/auth/security-form";
import { requireActiveUser } from "@/lib/auth/authorization";

export default async function SecurityPage() { return <DashboardShell user={await requireActiveUser()}><div className="mt-5 max-w-md"><h2 className="text-lg font-semibold">Change password</h2><PasswordChangeForm /></div></DashboardShell>; }
