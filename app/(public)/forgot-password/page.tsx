import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/recovery-forms";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      description="We will send reset instructions only if an account exists for this address."
      title="Reset your password"
    >
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
