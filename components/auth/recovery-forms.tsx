"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

async function authPost(path: string, body: Record<string, unknown>) {
  return fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setMessage(null);
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim().toLowerCase();
    await authPost("request-password-reset", { email, redirectTo: "/reset-password" });
    setPending(false); setMessage("If an account exists, check your inbox for reset instructions.");
  }
  return <form className="space-y-5" onSubmit={onSubmit}><FormField htmlFor="email" label="Email address"><Input autoComplete="email" id="email" name="email" required type="email" /></FormField>{message ? <p className="text-sm text-success" role="status">{message}</p> : null}<Button className="w-full" disabled={pending} type="submit">{pending ? "Sending…" : "Send reset instructions"}</Button><Link className="block text-center text-sm font-semibold text-primary underline" href="/login">Back to login</Link></form>;
}

export function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(null); setMessage(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    if (!token || password !== confirmPassword || password.length < 12) { setPending(false); setError("Enter matching passwords with at least 12 characters."); return; }
    const response = await authPost("reset-password", { token, newPassword: password });
    setPending(false);
    if (!response.ok) { setError("This reset link is invalid or expired."); return; }
    setMessage("Password updated. You can now log in.");
  }
  return <form className="space-y-5" onSubmit={onSubmit}><FormField htmlFor="password" label="New password"><PasswordInput autoComplete="new-password" id="password" name="password" required /></FormField><FormField htmlFor="confirmPassword" label="Confirm new password"><PasswordInput autoComplete="new-password" id="confirmPassword" name="confirmPassword" required /></FormField>{error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}{message ? <p className="text-sm text-success" role="status">{message}</p> : null}<Button className="w-full" disabled={pending || !token} type="submit">{pending ? "Updating…" : "Update password"}</Button></form>;
}

export function VerifyEmailMessage() {
  const params = useSearchParams();
  const token = params.get("token");
  return <div className="space-y-4"><p className="text-sm text-muted-foreground">{token ? "Your verification link is being processed securely." : "Check your inbox for a verification link. It expires after one hour."}</p><Link className="inline-flex text-sm font-semibold text-primary underline" href="/login">Continue to login</Link></div>;
}
