"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { safeRedirectPath } from "@/lib/auth/redirect";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const redirectTo = safeRedirectPath(searchParams.get("redirectTo"));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      password: String(formData.get("password") ?? ""),
      callbackURL: redirectTo,
    });
    setPending(false);
    if (result.error) setError("Unable to sign in with those credentials.");
  }

  return <form className="space-y-5" onSubmit={onSubmit}>
    <FormField htmlFor="email" label="Email address"><Input autoComplete="email" id="email" name="email" required type="email" /></FormField>
    <FormField htmlFor="password" label="Password"><PasswordInput autoComplete="current-password" id="password" name="password" required /></FormField>
    {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
    <Button className="w-full" disabled={pending} type="submit">{pending ? "Logging in…" : "Log in"}</Button>
    <div className="flex justify-between text-sm"><Link className="font-semibold text-primary underline" href="/forgot-password">Forgot password?</Link><Link className="font-semibold text-primary underline" href="/register">Create an account</Link></div>
  </form>;
}
