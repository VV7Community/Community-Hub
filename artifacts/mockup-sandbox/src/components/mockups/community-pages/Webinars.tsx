import "./_group.css";
import { Layout } from "./_shared/Layout";

const UPCOMING = [
  {
    id: 1,
    title: "Market Timing Q&A",
    date: "Today, 11:00 CET",
    duration: "60 min",
    audience: "Members only",
    status: "live-soon",
    host: "Bjarne",
  },
  {
    id: 2,
    title: "Swing Trading European Equities",
    date: "Tomorrow, 10:00 CET",
    duration: "90 min",
    audience: "Premium",
    status: "upcoming",
    host: "Marc Trading",
  },
  {
    id: 3,
    title: "VectorVest 7 Deep Dive",
    date: "Friday, 14:00 CET",
    duration: "120 min",
    audience: "All members",
    status: "upcoming",
    host: "Support Team",
  },
];

const RECORDED = [
  {
    id: 4,
    title: "Mastering the Color Guard",
    duration: "45 min",
    views: 128,
    date: "Oct 18, 2026",
  },
  {
    id: 5,
    title: "How to Read the MTI",
    duration: "38 min",
    views: 96,
    date: "Oct 12, 2026",
  },
  {
    id: 6,
    title: "Building a Watchlist for Benelux",
    duration: "52 min",
    views: 74,
    date: "Oct 5, 2026",
  },
];

export default function Webinars() {
  return (
    <Layout activePage="webinars">
      <div className="h-full overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--vv-text)]">Webinars</h1>
              <p className="text-sm text-[var(--vv-text-muted)]">Live sessions and recordings for the European VectorVest community.</p>
            </div>
            <button className="rounded-md border border-[var(--vv-border)] bg-[var(--vv-card)] px-4 py-2 text-sm font-medium text-[var(--vv-text)] transition-colors hover:bg-[var(--vv-card-hover)]">
              My Registrations
            </button>
          </div>

          <section className="mb-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--vv-gold)]">Upcoming live sessions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {UPCOMING.map((w) => (
                <div
                  key={w.id}
                  className="group relative overflow-hidden rounded-xl border border-[var(--vv-border)] bg-[var(--vv-card)] p-4 transition-all hover:border-[var(--vv-gold)]/30"
                >
                  {w.status === "live-soon" && (
                    <span className="absolute right-3 top-3 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400">
                      LIVE SOON
                    </span>
                  )}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--vv-gold)]/10 text-[var(--vv-gold)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <h3 className="mb-1 text-base font-bold text-[var(--vv-text)]">{w.title}</h3>
                  <p className="mb-3 text-xs text-[var(--vv-text-muted)]">
                    {w.date} • {w.duration} • {w.audience}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[var(--vv-text-muted)]">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--vv-gold)] text-[10px] font-bold text-[var(--vv-bg)]">
                      {w.host.slice(0, 1)}
                    </div>
                    Hosted by {w.host}
                  </div>
                  <button className="mt-4 w-full rounded-md bg-[var(--vv-gold)] py-2 text-sm font-semibold text-[var(--vv-bg)] transition-colors hover:bg-[var(--vv-gold-light)]">
                    {w.status === "live-soon" ? "Join Waiting Room" : "Register"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--vv-text-muted)]">Recordings</h2>
            <div className="space-y-2">
              {RECORDED.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-4 rounded-lg border border-[var(--vv-border)] bg-[var(--vv-card)] p-3 transition-colors hover:bg-[var(--vv-card-hover)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--vv-bg)] text-[var(--vv-gold)]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[var(--vv-text)]">{w.title}</h3>
                    <p className="text-xs text-[var(--vv-text-muted)]">
                      {w.duration} • {w.views} views • {w.date}
                    </p>
                  </div>
                  <button className="rounded-md px-3 py-1.5 text-xs font-medium text-[var(--vv-gold)] transition-colors hover:bg-[var(--vv-gold)]/10">
                    Watch
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
