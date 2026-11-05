import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCard description="Access your FoodRescue account securely." title="Welcome back">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
