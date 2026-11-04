import { HeartHandshake } from "lucide-react";
import Link from "next/link";

const navigation = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#partners", label: "For partners" },
  { href: "/#safety", label: "Safety" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link className="flex items-center gap-2 text-lg font-bold tracking-tight text-primary" href="/">
          <HeartHandshake aria-hidden="true" className="size-6" />
          FoodRescue
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => (
            <Link className="text-sm font-medium text-muted-foreground hover:text-foreground" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" href="/#partners">
          Partner with us
        </Link>
      </div>
    </header>
  );
}
