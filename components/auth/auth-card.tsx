import type { ReactNode } from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-lg items-center px-6 py-12">
      <Card className="w-full">
        <CardHeader>
          <Link className="text-sm font-bold text-primary" href="/">
            FoodRescue
          </Link>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
