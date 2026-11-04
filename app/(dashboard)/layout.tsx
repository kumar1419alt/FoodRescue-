import type { ReactNode } from "react";

/** Future protected dashboard frame; authorization is introduced in the auth phase. */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-muted/40">{children}</div>;
}
