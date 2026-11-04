import { HeartHandshake } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const navigation = ["How it works", "For partners", "Safety"];

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
            <Link className="text-sm font-medium text-muted-foreground hover:text-foreground" href="/" key={item}>
              {item}
            </Link>
          ))}
        </nav>
        <Button size="sm" variant="outline">Partner with us</Button>
      </div>
    </header>
  );
}
