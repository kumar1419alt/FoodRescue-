import { AuthCard } from "@/components/auth/auth-card";
import { RegistrationForm } from "@/components/auth/registration-form";

export default function NgoRegistrationPage() { return <AuthCard description="Create an NGO representative account. Verification begins as pending." title="Register as an NGO"><RegistrationForm role="ngo" /></AuthCard>; }
