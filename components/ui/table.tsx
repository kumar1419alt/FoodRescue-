import type { HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) { return <div className="overflow-x-auto rounded-xl border border-border"><table className={cn("w-full text-left text-sm", className)} {...props} /></div>; }
export function Pagination({ page = 1, pages = 1 }: { page?: number; pages?: number }) { return <nav aria-label="Pagination" className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Page {page} of {pages}</span><div className="flex gap-2"><button aria-label="Previous page" className="rounded border border-border p-2 disabled:opacity-50" disabled={page === 1}><ChevronLeft className="size-4" /></button><button aria-label="Next page" className="rounded border border-border p-2 disabled:opacity-50" disabled={page === pages}><ChevronRight className="size-4" /></button></div></nav>; }
