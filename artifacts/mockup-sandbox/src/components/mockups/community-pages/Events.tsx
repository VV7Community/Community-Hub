import "./_group.css";
import { Layout } from "./_shared/Layout";

const EVENTS = [
  {
    id: 1,
    day: "24",
    month: "OCT",
    title: "Market Timing Q&A",
    time: "11:00 CET",
    type: "Webinar",
    location: "Online",
    attendees: 42,
  },
  {
    id: 2,
    day: "28",
    month: "OCT",
    title: "VectorVest Benelux Meetup",
    time: "19:00 CET",
    type: "In-person",
    location: "Amsterdam",
    attendees: 18,
  },
  {
    id: 3,
    day: "05",
    month: "NOV",
    title: "Swing Trading Workshop",
    time: "10:00 CET",
    type: "Workshop",
    location: "Online",
    attendees: 64,
  },
  {
    id: 4,
    day: "12",
    month: "NOV",
    title: "European Markets Review",
    time: "14:00 CET",
    type: "Webinar",
    location: "Online",
    attendees: 31,
  },
];

export default function Events() {
  return (
    <Layout activePage="events">
      <div className="h-full overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--vv-text)]">Events</h1>
              <p className="text-sm text-[var(--vv-text-muted)]">Upcoming community meetups, webinars, and workshops.</p>
            </div>
            <button className="rounded-md bg-[var(--vv-gold)] px-4 py-2 text-sm font-semibold text-[var(--vv-bg)] transition-colors hover:bg-[var(--vv-gold-light)]">
              Add to Calendar
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className="flex gap-4 rounded-xl border border-[var(--vv-border)] bg-[var(--vv-card)] p-4 transition-colors hover:bg-[var(--vv-card-hover)]"
              >
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg border border-[var(--vv-border)] bg-[var(--vv-bg)]">
                  <span className="text-xs font-bold text-[var(--vv-gold)]">{event.month}</span>
                  <span className="font-display text-2xl font-bold text-[var(--vv-text)]">{event.day}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-[var(--vv-gold)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--vv-gold)]">
                      {event.type}
                    </span>
                    <span className="text-xs text-[var(--vv-text-muted)]">{event.location}</span>
                  </div>
                  <h3 className="mb-1 text-base font-bold text-[var(--vv-text)]">{event.title}</h3>
                  <p className="text-xs text-[var(--vv-text-muted)]">{event.time} • {event.attendees} attending</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {["BJ", "MT", "JV", "SV"].map((ini, i) => (
                        <div
                          key={i}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--vv-card)] bg-[var(--vv-gold)] text-[10px] font-bold text-[var(--vv-bg)]"
                        >
                          {ini}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-[var(--vv-text-muted)]">+{event.attendees - 4} more</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-[var(--vv-border)] bg-[var(--vv-card)] p-6">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--vv-gold)]/10 text-[var(--vv-gold)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[var(--vv-text)]">Have an event idea?</h3>
              <p className="max-w-md text-sm text-[var(--vv-text-muted)]">
                Propose a meetup, workshop, or trading session for the VectorVest Europe community.
              </p>
              <button className="rounded-md border border-[var(--vv-border)] px-4 py-2 text-sm font-medium text-[var(--vv-text)] transition-colors hover:bg-[var(--vv-bg)]">
                Propose an event
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
