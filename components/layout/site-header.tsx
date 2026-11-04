"use client";

import { HeartHandshake, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#partners", label: "For partners" },
  { href: "/#safety", label: "Safety" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="border-b border-border bg-background/95">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
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
        <Link className="hidden h-9 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:inline-flex" href="/#partners">
          Partner with us
        </Link>
        <button aria-controls="mobile-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"} className="rounded-lg p-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        {menuOpen && <nav aria-label="Mobile navigation" className="absolute left-0 right-0 top-full z-20 border-b border-border bg-card p-4 shadow-lg md:hidden" id="mobile-navigation"><div className="flex flex-col gap-1">{navigation.map((item) => <Link className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-muted" href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}<Link className="mt-2 rounded-md bg-primary px-3 py-3 text-center text-sm font-semibold text-primary-foreground" href="/#partners" onClick={() => setMenuOpen(false)}>Partner with us</Link></div></nav>}
      </div>
    </header>
  );
}
