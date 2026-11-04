import { User } from "lucide-react";
import { cn } from "@/lib/utils";
export function Avatar({ name, className }: { name?: string; className?: string }) { const initials = name?.split(" ").map((part) => part[0]).join("").slice(0, 2); return <span aria-label={name ?? "User"} className={cn("inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary", className)}>{initials || <User className="size-4" />}</span>; }
