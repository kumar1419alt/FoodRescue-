import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "FoodRescue",
  description: "Connecting surplus food with communities that need it.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased"><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
