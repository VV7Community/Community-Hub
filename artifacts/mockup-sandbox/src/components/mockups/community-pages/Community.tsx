import "./_group.css";
import { Layout } from "./_shared/Layout";

const MESSAGES = [
  {
    id: 1,
    user: "Marc Trading",
    initials: "MT",
    color: "#10b981",
    time: "09:15",
    text: "Good morning everyone! Just checked the Color Guard, looking a bit bearish today. Might hold off on new entries.",
  },
  {
    id: 2,
    user: "Jeroen V.",
    initials: "JV",
    color: "#3b82f6",
    time: "09:18",
    text: "Agreed Marc. The MTI is dipping below 1.0. I'm keeping an eye on my stops.",
  },
  {
    id: 3,
    user: "bjarne",
    initials: "BJ",
    color: "#c8a05a",
    time: "09:25",
    text: "Just a reminder, we have a live Q&A webinar covering the current market timing signals at 11:00 CET. We'll look specifically at the CAC and European indices.",
    isAdmin: true,
  },
  {
    id: 4,
    user: "Sarah V.",
    initials: "SV",
    color: "#a855f7",
    time: "09:30",
    text: "Thanks Bjarne! I'll be there. I have a few questions about the recent trends on the AEX.",
  },
];

const ONLINE_USERS = [
  { name: "bjarne", initials: "BJ", color: "#c8a05a" },
  { name: "Marc Trading", initials: "MT", color: "#10b981" },
  { name: "Jeroen V.", initials: "JV", color: "#3b82f6" },
  { name: "Sarah V.", initials: "SV", color: "#a855f7" },
  { name: "PeterDeK", initials: "PD", color: "#f59e0b" },
  { name: "LindaTrade", initials: "LT", color: "#ec4899" },
];

export default function Community() {
  return (
    <Layout activePage="chat" activeChannel="main-room">
      <div className="flex h-full w-full">
        {/* Chat area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Channel header */}
          <div className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--vv-border)] bg-[var(--vv-bg)] px-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0 text-[var(--vv-text-muted)]"
            >
              <line x1="4" y1="9" x2="20" y2="9" />
              <line x1="4" y1="15" x2="20" y2="15" />
              <line x1="10" y1="3" x2="8" y2="21" />
              <line x1="16" y1="3" x2="14" y2="21" />
            </svg>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-[var(--vv-text)]">main-room</h2>
              <p className="text-xs text-[var(--vv-text-muted)]">General discussion for VectorVest Europe members</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-xs text-[var(--vv-text-muted)]">
              <span className="h-2 w-2 rounded-full bg-[var(--vv-online)]" />
              42 online
            </div>
          </div>

          {/* Pinned webinar card */}
          <div className="mx-4 mt-4 flex items-start gap-3 rounded-lg border border-[var(--vv-border)] bg-[var(--vv-card)] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--vv-gold)]/10 text-[var(--vv-gold)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--vv-text)]">Market Timing Q&A</span>
                <span className="rounded-full bg-[var(--vv-gold)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--vv-gold)]">
                  Members only
                </span>
              </div>
              <p className="text-xs text-[var(--vv-text-muted)]">Starts in 1h 35m • Live</p>
            </div>
            <button className="rounded-md bg-[var(--vv-gold)] px-3 py-1.5 text-xs font-semibold text-[var(--vv-bg)] transition-colors hover:bg-[var(--vv-gold-light)]">
              Join Waiting Room
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="text-center text-xs text-[var(--vv-text-dim)]">Today, October 24</div>
            {MESSAGES.map((msg) => (
              <div key={msg.id} className="group flex gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: msg.color }}
                >
                  {msg.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-sm font-semibold ${msg.isAdmin ? "text-[var(--vv-gold)]" : "text-[var(--vv-text)]"}`}>
                      {msg.user}
                    </span>
                    {msg.isAdmin && (
                      <span className="rounded bg-[var(--vv-gold)]/10 px-1.5 py-0.5 text-[10px] font-bold text-[var(--vv-gold)]">
                        ADMIN
                      </span>
                    )}
                    <span className="text-xs text-[var(--vv-text-dim)]">{msg.time}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--vv-text)]/90">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-[var(--vv-border)] bg-[var(--vv-bg)] p-3">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--vv-border)] bg-[var(--vv-card)] px-3 py-2">
              <button className="text-[var(--vv-text-muted)] hover:text-[var(--vv-text)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Message #main-room..."
                className="flex-1 bg-transparent text-sm text-[var(--vv-text)] placeholder:text-[var(--vv-text-dim)] outline-none"
              />
              <button className="rounded-md bg-[var(--vv-gold)] p-2 text-[var(--vv-bg)] transition-colors hover:bg-[var(--vv-gold-light)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right panel: online users */}
        <aside className="hidden w-56 shrink-0 border-l border-[var(--vv-border)] bg-[var(--vv-sidebar)] lg:flex flex-col">
          <div className="flex h-12 items-center border-b border-[var(--vv-border)] px-4">
            <h3 className="text-sm font-bold text-[var(--vv-text)]">Online — 42</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {ONLINE_USERS.map((u) => (
              <div key={u.name} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-[var(--vv-card)]/50">
                <div className="relative">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: u.color }}
                  >
                    {u.initials}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--vv-sidebar)] bg-[var(--vv-online)]" />
                </div>
                <span className="text-sm text-[var(--vv-text-muted)]">{u.name}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </Layout>
  );
}
