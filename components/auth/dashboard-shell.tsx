import Link from "next/link";
import type { ReactNode } from "react";

import type { UserRole, VerificationStatus } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";

const labels: Record<UserRole, string> = { donor: "Donor", ngo: "NGO", volunteer: "Volunteer", admin: "Administrator" };

export function DashboardShell({
  user,
  membership,
  children,
}: {
  user: { displayName: string; email: string; role: UserRole; emailVerified: boolean };
  membership?: { organization: { name: string; verification?: { status: VerificationStatus } | null } } | null;
  children?: ReactNode;
}) {
  return <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 lg:px-8"><header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6"><div><Link className="font-bold text-primary" href="/">FoodRescue</Link><h1 className="mt-3 text-3xl font-bold">Welcome, {user.displayName}</h1><p className="mt-1 text-muted-foreground">Your protected {labels[user.role].toLowerCase()} workspace.</p></div><nav aria-label="Account navigation" className="flex items-center gap-4 text-sm font-semibold"><Link className="text-primary underline" href="/profile">Profile</Link><Link className="text-primary underline" href="/settings/security">Security</Link><LogoutButton /></nav></header><section className="mt-8 grid gap-4 md:grid-cols-3"><Card><CardHeader><h2 className="font-semibold">Account</h2></CardHeader><CardContent><p className="text-sm">{user.email}</p><Badge className="mt-3" variant="neutral">{labels[user.role]}</Badge></CardContent></Card><Card><CardHeader><h2 className="font-semibold">Email status</h2></CardHeader><CardContent><Badge variant={user.emailVerified ? "success" : "warning"}>{user.emailVerified ? "Verified" : "Verification required"}</Badge></CardContent></Card><Card><CardHeader><h2 className="font-semibold">Organization</h2></CardHeader><CardContent>{membership ? <><p className="text-sm font-medium">{membership.organization.name}</p>{membership.organization.verification ? <Badge className="mt-3" variant={membership.organization.verification.status === "approved" ? "success" : "warning"}>{membership.organization.verification.status}</Badge> : null}</> : <p className="text-sm text-muted-foreground">No organization membership yet.</p>}</CardContent></Card></section><section className="mt-8 rounded-xl border border-dashed border-border bg-card p-6"><h2 className="text-lg font-semibold">What&apos;s next</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Operational donation, assignment, and impact data will appear here in later FoodRescue phases. No counts or activity are fabricated.</p>{children}</section></main>;
}
