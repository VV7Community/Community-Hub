import { ReactNode } from "react";

export type NavPage = "chat" | "webinars" | "university" | "events" | "support";

interface LayoutProps {
  activePage: NavPage;
  activeChannel?: string;
  children: ReactNode;
}

const NAV_ITEMS: { id: NavPage; label: string }[] = [
  { id: "chat", label: "Chat" },
  { id: "webinars", label: "Webinars" },
  { id: "university", label: "University" },
  { id: "events", label: "Events" },
  { id: "support", label: "Support" },
];

const TRADING_FLOORS = [
  { id: "main-room", label: "main-room", unread: 0 },
  { id: "market-open", label: "market-open", unread: 3 },
  { id: "swing-trading", label: "swing-trading", unread: 0 },
  { id: "belgium-nl", label: "belgium-nl", unread: 7 },
];

const RESOURCES = [
  { id: "live-webinars", label: "live-webinars", unread: 0 },
  { id: "course-discussion", label: "course-discussion", unread: 0 },
  { id: "upcoming-events", label: "upcoming-events", unread: 2 },
];

const DIRECT_MESSAGES = [
  { id: "support-team", label: "Support Team", status: "staff" as const },
  { id: "jeroen", label: "Jeroen V.", status: "online" as const },
  { id: "marc", label: "Marc Trading", status: "online" as const },
  { id: "sarah", label: "Sarah V.", status: "offline" as const },
];

function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="VectorVest">
      <defs>
        <linearGradient id="vv-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ecd69b" />
          <stop offset="0.5" stopColor="#cda35d" />
          <stop offset="1" stopColor="#b5883c" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="#1b2157" />
      <polygon points="12,56 44,56 12,88" fill="url(#vv-gold)" />
      <polygon points="8,30 30,8 92,70 70,92" fill="#f7f8fc" />
    </svg>
  );
}

function HashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 opacity-70"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

export function Layout({ activePage, activeChannel = "main-room", children }: LayoutProps) {
  return (
    <div className="vv-community flex h-screen w-full overflow-hidden bg-[var(--vv-bg)] text-[var(--vv-text)]">
      {/* Left Sidebar */}
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-[var(--vv-border)] bg-[var(--vv-sidebar)]">
        {/* Scrollable channel groups */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Trading Floors */}
          <section>
            <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--vv-text-muted)]">
              Trading Floors
            </h3>
            <div className="space-y-0.5">
              {TRADING_FLOORS.map((ch) => {
                const isActive = activePage === "chat" && activeChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--vv-card)] text-[var(--vv-text)]"
                        : "text-[var(--vv-text-muted)] hover:bg-[var(--vv-card)]/50 hover:text-[var(--vv-text)]"
                    }`}
                  >
                    <HashIcon />
                    <span className="truncate">{ch.label}</span>
                    {ch.unread > 0 && (
                      <span className="ml-auto flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--vv-gold)] px-1 text-[10px] font-bold text-[var(--vv-bg)]">
                        {ch.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Resources */}
          <section>
            <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--vv-text-muted)]">
              Resources
            </h3>
            <div className="space-y-0.5">
              {RESOURCES.map((ch) => {
                const isActive = activePage === "chat" && activeChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--vv-card)] text-[var(--vv-text)]"
                        : "text-[var(--vv-text-muted)] hover:bg-[var(--vv-card)]/50 hover:text-[var(--vv-text)]"
                    }`}
                  >
                    <HashIcon />
                    <span className="truncate">{ch.label}</span>
                    {ch.unread > 0 && (
                      <span className="ml-auto flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--vv-gold)] px-1 text-[10px] font-bold text-[var(--vv-bg)]">
                        {ch.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Direct Messages */}
          <section>
            <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--vv-text-muted)]">
              Direct Messages
            </h3>
            <div className="space-y-0.5">
              {DIRECT_MESSAGES.map((dm) => (
                <button
                  key={dm.id}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-[var(--vv-text-muted)] transition-colors hover:bg-[var(--vv-card)]/50 hover:text-[var(--vv-text)]"
                >
                  <div className="relative">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--vv-card)] text-[10px] font-bold text-[var(--vv-text)]">
                      {dm.label.split(" ")[0].slice(0, 1)}
                    </div>
                    {dm.status === "online" && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[var(--vv-sidebar)] bg-[var(--vv-online)]" />
                    )}
                    {dm.status === "offline" && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[var(--vv-sidebar)] bg-[var(--vv-text-dim)]" />
                    )}
                    {dm.status === "staff" && (
                      <span className="absolute -bottom-0.5 -right-0.5 rounded-full border border-[var(--vv-sidebar)] bg-[var(--vv-gold)] px-1 text-[8px] font-bold text-[var(--vv-bg)]">
                        staff
                      </span>
                    )}
                  </div>
                  <span className="truncate">{dm.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* User footer */}
        <div className="flex items-center gap-3 border-t border-[var(--vv-border)] p-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--vv-gold)] text-sm font-bold text-[var(--vv-bg)]">
              BJ
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--vv-sidebar)] bg-[var(--vv-online)]" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-[var(--vv-text)]">bjarne</span>
            <span className="text-xs text-[var(--vv-gold)]">Admin</span>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Navigation */}
        <header className="flex h-14 shrink-0 items-center border-b border-[var(--vv-border)] bg-[var(--vv-sidebar)] px-4 shadow-sm">
          <div className="flex items-center gap-2.5 mr-4 leading-none">
            <LogoMark className="h-8 w-8 shrink-0" />
            <span className="font-display text-lg font-bold tracking-tight text-[var(--vv-text)]">VectorVest</span>
          </div>
          <nav className="flex h-full items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`relative flex h-full items-center gap-2 px-4 text-sm font-medium transition-colors ${
                  activePage === item.id
                    ? "text-[var(--vv-gold)]"
                    : "text-[var(--vv-text-muted)] hover:text-[var(--vv-text)]"
                }`}
              >
                {item.label}
                {activePage === item.id && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--vv-gold)]" />
                )}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs font-medium text-[var(--vv-text-muted)]">bjarne</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--vv-gold)]/30 bg-[var(--vv-card)] text-xs font-bold text-[var(--vv-text)]">
              BJ
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden bg-[var(--vv-bg)]">{children}</main>
      </div>
    </div>
  );
}
