import { AuthCard } from "@/components/auth/auth-card";
import { RegistrationForm } from "@/components/auth/registration-form";

export default function VolunteerRegistrationPage() { return <AuthCard description="Create a volunteer account. You will access only assignments made to you." title="Register as a volunteer"><RegistrationForm role="volunteer" /></AuthCard>; }
