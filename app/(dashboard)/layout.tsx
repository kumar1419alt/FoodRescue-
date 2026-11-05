import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/authorization";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user || !user.isActive) {
    redirect("/login?redirectTo=/dashboard");
  }

  return <div className="min-h-screen bg-muted/40">{children}</div>;
}
