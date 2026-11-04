import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { VerifyEmailMessage } from "@/components/auth/recovery-forms";

export default function VerifyEmailPage() {
  return (
    <AuthCard
      description="Email verification protects access to your FoodRescue account."
      title="Verify your email"
    >
      <Suspense>
        <VerifyEmailMessage />
      </Suspense>
    </AuthCard>
  );
}
