import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold tracking-[0.16em] text-accent uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
    </div>
  );
}
