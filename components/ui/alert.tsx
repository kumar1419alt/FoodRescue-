import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const icons = { info: Info, success: CheckCircle2, error: AlertCircle };
export function Alert({ className, title, children, variant = "info" }: HTMLAttributes<HTMLDivElement> & { title: string; variant?: keyof typeof icons }) { const Icon = icons[variant]; return <div className={cn("flex gap-3 rounded-lg border p-4", variant === "error" ? "border-red-200 bg-red-50 text-destructive" : variant === "success" ? "border-emerald-200 bg-emerald-50 text-success" : "border-primary/20 bg-primary/5 text-foreground", className)} role="alert"><Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" /><div><p className="font-semibold">{title}</p><div className="mt-1 text-sm opacity-90">{children}</div></div></div>; }
