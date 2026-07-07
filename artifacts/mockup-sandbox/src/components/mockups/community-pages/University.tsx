import "./_group.css";
import { Layout } from "./_shared/Layout";

const COURSES = [
  {
    id: 1,
    title: "VectorVest 7 Fundamentals",
    description: "Learn the core indicators: VST, RV, RS, and the Color Guard.",
    lessons: 12,
    duration: "2h 30m",
    level: "Beginner",
    progress: 0,
  },
  {
    id: 2,
    title: "Market Timing for Europe",
    description: "How to use the MTI and Color Guard with European indices.",
    lessons: 8,
    duration: "1h 45m",
    level: "Intermediate",
    progress: 35,
  },
  {
    id: 3,
    title: "Swing Trading Strategy",
    description: "A complete rules-based approach for short-term trades.",
    lessons: 14,
    duration: "3h 10m",
    level: "Advanced",
    progress: 0,
  },
  {
    id: 4,
    title: "Building Your Watchlist",
    description: "Create, sort, and maintain a focused watchlist for the Benelux market.",
    lessons: 5,
    duration: "55m",
    level: "Beginner",
    progress: 0,
  },
];

const RESOURCES = [
  { title: "Color Guard Cheat Sheet", type: "PDF" },
  { title: "European Market Calendar", type: "Sheet" },
  { title: "Stop-Loss Calculator", type: "Tool" },
];

export default function University() {
  return (
    <Layout activePage="university">
      <div className="h-full overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-[var(--vv-text)]">University</h1>
            <p className="text-sm text-[var(--vv-text-muted)]">Self-paced courses and resources to master VectorVest.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {COURSES.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl border border-[var(--vv-border)] bg-[var(--vv-card)] p-4 transition-colors hover:bg-[var(--vv-card-hover)]"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--vv-gold)]/10 text-[var(--vv-gold)]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[var(--vv-text)]">{course.title}</h3>
                        <p className="text-xs text-[var(--vv-text-muted)]">
                          {course.lessons} lessons • {course.duration} • {course.level}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-[var(--vv-border)] px-2 py-0.5 text-[10px] font-bold text-[var(--vv-text-muted)]">
                      {course.level}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-[var(--vv-text-muted)]">{course.description}</p>
                  {course.progress > 0 && (
                    <div className="mb-3">
                      <div className="mb-1 flex justify-between text-xs text-[var(--vv-text-muted)]">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--vv-bg)]">
                        <div
                          className="h-1.5 rounded-full bg-[var(--vv-gold)]"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <button className="rounded-md bg-[var(--vv-gold)] px-4 py-1.5 text-xs font-semibold text-[var(--vv-bg)] transition-colors hover:bg-[var(--vv-gold-light)]">
                    {course.progress > 0 ? "Continue" : "Start Course"}
                  </button>
                </div>
              ))}
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-[var(--vv-border)] bg-[var(--vv-card)] p-4">
                <h3 className="mb-3 text-sm font-bold text-[var(--vv-text)]">Quick Resources</h3>
                <div className="space-y-2">
                  {RESOURCES.map((r) => (
                    <button
                      key={r.title}
                      className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm text-[var(--vv-text-muted)] transition-colors hover:bg-[var(--vv-bg)]"
                    >
                      <span>{r.title}</span>
                      <span className="rounded bg-[var(--vv-bg)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--vv-gold)]">
                        {r.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[var(--vv-border)] bg-[var(--vv-card)] p-4">
                <h3 className="mb-1 text-sm font-bold text-[var(--vv-text)]">Need help?</h3>
                <p className="mb-3 text-xs text-[var(--vv-text-muted)]">
                  Ask the community in the course-discussion channel or open a support ticket.
                </p>
                <button className="w-full rounded-md border border-[var(--vv-border)] py-1.5 text-xs font-medium text-[var(--vv-text)] transition-colors hover:bg-[var(--vv-bg)]">
                  Open course discussion
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
