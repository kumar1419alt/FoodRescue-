import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodRescue",
  description: "Connecting surplus food with communities that need it.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
