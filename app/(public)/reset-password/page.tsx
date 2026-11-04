import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/recovery-forms";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      description="Choose a new secure password. This link can be used only once."
      title="Choose a new password"
    >
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
