"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;
export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) { return <TabsPrimitive.List className={cn("inline-flex rounded-lg bg-muted p-1", className)} {...props} />; }
export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) { return <TabsPrimitive.Trigger className={cn("rounded-md px-3 py-1.5 text-sm font-semibold text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm", className)} {...props} />; }
