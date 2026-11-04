import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold", { variants: { variant: { default: "bg-primary/10 text-primary", success: "bg-success/10 text-success", warning: "bg-orange-100 text-warning", neutral: "bg-muted text-muted-foreground", danger: "bg-red-100 text-destructive" } }, defaultVariants: { variant: "default" } });
export function Badge({ className, variant, ...props }: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) { return <span className={cn(badgeVariants({ variant }), className)} {...props} />; }
