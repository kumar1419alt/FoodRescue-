"use client";

import { FormEvent, useState } from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

export function PasswordChangeForm() {
  const [pending, setPending] = useState(false); const [message, setMessage] = useState<string | null>(null); const [error, setError] = useState<string | null>(null);
  async function onSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setPending(true); setError(null); setMessage(null); const data = new FormData(event.currentTarget); const response = await fetch("/api/auth/change-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ currentPassword: data.get("currentPassword"), newPassword: data.get("newPassword"), revokeOtherSessions: true }) }); setPending(false); if (!response.ok) { setError("We could not change your password. Confirm your current password and try again."); return; } setMessage("Password changed. Other sessions were signed out."); }
  return <form className="mt-4 space-y-4" onSubmit={onSubmit}><FormField htmlFor="currentPassword" label="Current password"><PasswordInput autoComplete="current-password" id="currentPassword" name="currentPassword" required /></FormField><FormField htmlFor="newPassword" label="New password"><PasswordInput autoComplete="new-password" id="newPassword" name="newPassword" required /></FormField>{error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}{message ? <p className="text-sm text-success" role="status">{message}</p> : null}<Button disabled={pending} type="submit">{pending ? "Updating…" : "Change password"}</Button></form>;
}
