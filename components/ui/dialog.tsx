"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
export const Dialog = DialogPrimitive.Root; export const DialogTrigger = DialogPrimitive.Trigger;
export function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) { return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" /><DialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-6 shadow-xl focus:outline-none", className)} {...props}>{children}<DialogPrimitive.Close aria-label="Close dialog" className="absolute right-4 top-4 rounded p-1 text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"><X className="size-4" /></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>; }
