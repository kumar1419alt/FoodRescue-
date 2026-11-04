import { ArrowRight, Building2, ShieldCheck, Truck } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/shared/section-heading";

const principles = [
  { icon: Building2, title: "Local partners", description: "Connect verified donors and NGOs around a shared neighborhood." },
  { icon: ShieldCheck, title: "Safety first", description: "Build every hand-off around clear food safety checks and accountability." },
  { icon: Truck, title: "Traceable impact", description: "Follow each donation from surplus food to community distribution." },
];

export default function Home() {
  return (
    <AppShell>
      <section className="bg-primary px-6 py-20 text-primary-foreground sm:py-28 lg:px-8" id="how-it-works">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-bold tracking-[0.16em] text-orange-200 uppercase">A better route for surplus food</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">Good food belongs with people, not in landfill.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">FoodRescue helps local donors, verified NGOs, and volunteers safely redirect quality surplus food to the communities they serve.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary" href="#partners">Meet the future partners <ArrowRight aria-hidden="true" className="ml-2 size-4" /></a>
              <a className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 bg-transparent px-6 text-base font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary" href="#safety">Explore our safety approach</a>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-sm">
            <p className="text-sm font-semibold text-orange-200">Designed for every safe hand-off</p>
            <ol className="mt-6 space-y-4 text-sm">
              {['Donate surplus food', 'Match with a verified NGO', 'Collect, inspect, and deliver', 'Record community impact'].map((step, index) => <li className="flex items-center gap-3" key={step}><span className="flex size-7 items-center justify-center rounded-full bg-white/15 font-bold">{index + 1}</span>{step}</li>)}
            </ol>
          </div>
        </div>
      </section>
      <section className="px-6 py-20 lg:px-8" id="safety">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Accountable by design" title="One shared workflow for food that can still do good." description="A future-ready foundation for donors, NGOs, volunteers, and administrators—built around safety, traceability, and measurable impact." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, description }) => <article className="rounded-2xl border border-border bg-card p-7 shadow-sm" key={title}><Icon aria-hidden="true" className="size-7 text-primary" /><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{description}</p></article>)}
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-muted px-6 py-20 lg:px-8" id="partners">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Built for collaboration" title="A shared system for the people who move food forward." description="Donor, NGO, volunteer, and administrator workspaces will be introduced in later phases. This foundation makes their future workflows clear without presenting inactive account actions today." />
        </div>
      </section>
    </AppShell>
  );
}
