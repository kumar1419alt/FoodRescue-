import { AuthCard } from "@/components/auth/auth-card";
import { RegistrationForm } from "@/components/auth/registration-form";

export default function DonorRegistrationPage() { return <AuthCard description="Create a donor account to begin verified organization onboarding." title="Register as a donor"><RegistrationForm role="donor" /></AuthCard>; }
