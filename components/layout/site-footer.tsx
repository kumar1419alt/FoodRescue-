export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} FoodRescue. Better food systems, together.</p>
        <p>Built for safe, accountable food redistribution.</p>
      </div>
    </footer>
  );
}
