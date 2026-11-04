"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { PublicRegistrationRole } from "@/lib/auth/roles";

const roleCopy: Record<PublicRegistrationRole, { title: string; description: string }> = {
  donor: { title: "Create donor account", description: "Register as a food donor. Organization access is granted only through an authorized membership process." },
  ngo: { title: "Create NGO account", description: "Register an NGO representative account. NGO operations remain restricted until organization verification is approved." },
  volunteer: { title: "Create volunteer account", description: "Register a personal volunteer account. You will only see assignments specifically assigned to you." },
};

export function RegistrationForm({ role }: { role: PublicRegistrationRole }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const copy = roleCopy[role];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        displayName: formData.get("displayName"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
        organizationName: formData.get("organizationName") || undefined,
        role,
      }),
    });
    const result = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
    setPending(false);
    if (!response.ok) {
      setError(result.error ?? "We could not create your account. Please try again.");
      return;
    }
    setMessage(result.message ?? "Check your inbox to verify your account.");
    router.prefetch("/login");
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">{copy.description}</p>
      <FormField htmlFor="displayName" label="Full name">
        <Input autoComplete="name" id="displayName" name="displayName" required />
      </FormField>
      <FormField htmlFor="email" label="Email address">
        <Input autoComplete="email" id="email" name="email" required type="email" />
      </FormField>
      {role === "ngo" ? <FormField htmlFor="organizationName" label="NGO name"><Input id="organizationName" name="organizationName" required /></FormField> : null}
      <FormField hint="At least 12 characters, including uppercase, lowercase, and a number." htmlFor="password" label="Password">
        <PasswordInput autoComplete="new-password" id="password" name="password" required />
      </FormField>
      <FormField htmlFor="confirmPassword" label="Confirm password">
        <PasswordInput autoComplete="new-password" id="confirmPassword" name="confirmPassword" required />
      </FormField>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      {message ? <p className="text-sm text-success" role="status">{message}</p> : null}
      <Button className="w-full" disabled={pending} type="submit">{pending ? "Creating account…" : copy.title}</Button>
      <p className="text-center text-sm text-muted-foreground">Already registered? <Link className="font-semibold text-primary underline" href="/login">Log in</Link></p>
    </form>
  );
}
