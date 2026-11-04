"use client";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, X } from "lucide-react";
type Toast = { id: number; message: string };
const ToastContext = createContext<{ toast: (message: string) => void }>({ toast: () => undefined });
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const toast = useCallback((message: string) => {
    const id = Date.now();
    setItems((current) => [...current, { id, message }]);
    window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 4000);
  }, []);

  return <ToastContext.Provider value={{ toast }}>{children}<div aria-live="polite" className="fixed bottom-4 right-4 z-50 space-y-2">{items.map((item) => <div className="flex items-center gap-3 rounded-lg bg-foreground px-4 py-3 text-sm text-background shadow-lg" key={item.id}><CheckCircle2 className="size-4 text-orange-300" />{item.message}<button aria-label="Dismiss notification" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}><X className="size-4" /></button></div>)}</div></ToastContext.Provider>;
}
export const useToast = () => useContext(ToastContext);
