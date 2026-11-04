"use client";
import { type ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export function ConfirmationDialog({ trigger, title, description, confirmLabel = "Confirm", onConfirm }: { trigger: ReactNode; title: string; description: string; confirmLabel?: string; onConfirm?: () => void }) { return <Dialog><DialogTrigger asChild>{trigger}</DialogTrigger><DialogContent><h2 className="text-lg font-bold">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{description}</p><div className="mt-6 flex justify-end"><Button onClick={onConfirm}>{confirmLabel}</Button></div></DialogContent></Dialog>; }
