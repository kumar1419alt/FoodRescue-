"use client";
import { useState, type ReactElement } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmationDialog({ trigger, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm }: { trigger: ReactElement; title: string; description: string; confirmLabel?: string; cancelLabel?: string; onConfirm: () => void | Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirm = async () => {
    if (pending) return;
    setPending(true); setError(null);
    try { await onConfirm(); setOpen(false); } catch { setError("We could not complete that action. Please try again."); } finally { setPending(false); }
  };
  return <Dialog onOpenChange={(next) => { if (!pending) { setOpen(next); if (!next) setError(null); } }} open={open}><DialogTrigger asChild>{trigger}</DialogTrigger><DialogContent><DialogTitle className="text-lg font-bold">{title}</DialogTitle><DialogDescription className="mt-2 text-sm text-muted-foreground">{description}</DialogDescription>{error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}<div className="mt-6 flex justify-end gap-3"><button className="h-10 rounded-full border border-border px-4 text-sm font-semibold disabled:opacity-50" disabled={pending} onClick={() => setOpen(false)} type="button">{cancelLabel}</button><Button disabled={pending} onClick={confirm} type="button">{pending ? "Working…" : confirmLabel}</Button></div></DialogContent></Dialog>;
}
