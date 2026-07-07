import { TopNav } from "./TopNav";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background text-foreground overflow-hidden">
      <TopNav />
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
