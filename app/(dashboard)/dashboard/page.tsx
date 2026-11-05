import { redirect } from "next/navigation";

import { dashboardByRole } from "@/lib/auth/roles";
import { requireActiveUser } from "@/lib/auth/authorization";

export default async function DashboardPage() { const user = await requireActiveUser(); redirect(dashboardByRole[user.role]); }
