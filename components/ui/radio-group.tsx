"use client";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
export const RadioGroup = RadioGroupPrimitive.Root;
export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) { return <RadioGroupPrimitive.Item className={cn("flex size-5 items-center justify-center rounded-full border border-border bg-card focus-visible:ring-2 focus-visible:ring-ring data-[state=checked]:border-primary", className)} {...props}><RadioGroupPrimitive.Indicator><Circle className="size-2.5 fill-primary text-primary" /></RadioGroupPrimitive.Indicator></RadioGroupPrimitive.Item>; }
