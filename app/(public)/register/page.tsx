import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { LinkButton } from "@/components/ui/button";

const accountTypes = [
  { href: "/register/donor", title: "Donor", text: "Restaurants, hotels, event organizers, marriage halls, and households." },
  { href: "/register/ngo", title: "NGO", text: "Organizations that receive and distribute safe surplus food." },
  { href: "/register/volunteer", title: "Volunteer", text: "People assigned to inspect, collect, and deliver food." },
];

export default function RegisterPage() {
  return (
    <AuthCard description="Choose the account type that reflects your role in the food-rescue network." title="Join FoodRescue">
      <div className="space-y-4">
        {accountTypes.map((account) => <section className="rounded-lg border border-border p-4" key={account.href}><h2 className="font-semibold">{account.title}</h2><p className="mt-1 text-sm text-muted-foreground">{account.text}</p><LinkButton className="mt-4" href={account.href} size="sm" variant="outline">Register as {account.title}</LinkButton></section>)}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already registered? <Link className="font-semibold text-primary underline" href="/login">Log in</Link></p>
    </AuthCard>
  );
}
