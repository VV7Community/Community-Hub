import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background text-foreground overflow-hidden">
      <TopNav />
      {/* pb-14 on mobile reserves space above the fixed BottomNav */}
      <main className="flex-1 overflow-hidden relative pb-14 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
