import "./_group.css";
import { Layout } from "./_shared/Layout";

const FAQS = [
  {
    question: "How do I access the VectorVest 7 platform?",
    answer: "Use your VectorVest credentials at the login portal. Premium members get access to the European data feed.",
  },
  {
    question: "When are the live market timing webinars?",
    answer: "Live Q&A sessions run on Tuesday and Thursday mornings at 11:00 CET. Check the Webinars tab for the schedule.",
  },
  {
    question: "Can I change my membership plan?",
    answer: "Yes. Contact the Support Team via direct message or email support@vectorvest.eu for plan changes.",
  },
  {
    question: "Where do I find recordings of past sessions?",
    answer: "All recordings are listed in the Webinars tab under the 'Recordings' section.",
  },
];

const TICKETS = [
  { id: "#1283", subject: "Question about MTI alert", status: "Open", updated: "2 hours ago" },
  { id: "#1271", subject: "Cannot access webinar room", status: "Resolved", updated: "Yesterday" },
];

export default function Support() {
  return (
    <Layout activePage="support">
      <div className="h-full overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-[var(--vv-text)]">Support</h1>
            <p className="text-sm text-[var(--vv-text-muted)]">Get help from the VectorVest team and the community.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-[var(--vv-border)] bg-[var(--vv-card)] p-5">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--vv-gold)]">Frequently asked questions</h2>
                <div className="space-y-3">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="rounded-lg border border-[var(--vv-border)] bg-[var(--vv-bg)] p-3">
                      <h3 className="mb-1 text-sm font-semibold text-[var(--vv-text)]">{faq.question}</h3>
                      <p className="text-xs leading-relaxed text-[var(--vv-text-muted)]">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[var(--vv-border)] bg-[var(--vv-card)] p-5">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--vv-gold)]">Contact support</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-[var(--vv-border)] bg-[var(--vv-bg)] p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--vv-gold)]/10 text-[var(--vv-gold)]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-[var(--vv-text)]">Community chat</h3>
                    <p className="mb-3 text-xs text-[var(--vv-text-muted)]">Ask the Support Team channel or DM a moderator.</p>
                    <button className="rounded-md bg-[var(--vv-gold)] px-3 py-1.5 text-xs font-semibold text-[var(--vv-bg)] transition-colors hover:bg-[var(--vv-gold-light)]">
                      Open chat
                    </button>
                  </div>
                  <div className="rounded-lg border border-[var(--vv-border)] bg-[var(--vv-bg)] p-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--vv-gold)]/10 text-[var(--vv-gold)]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-[var(--vv-text)]">Email support</h3>
                    <p className="mb-3 text-xs text-[var(--vv-text-muted)]">For billing and account issues.</p>
                    <button className="rounded-md border border-[var(--vv-border)] px-3 py-1.5 text-xs font-medium text-[var(--vv-text)] transition-colors hover:bg-[var(--vv-gold)]/10 hover:text-[var(--vv-gold)]">
                      support@vectorvest.eu
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-[var(--vv-border)] bg-[var(--vv-card)] p-5">
                <h3 className="mb-3 text-sm font-bold text-[var(--vv-text)]">My tickets</h3>
                <div className="space-y-2">
                  {TICKETS.map((t) => (
                    <div key={t.id} className="rounded-lg border border-[var(--vv-border)] bg-[var(--vv-bg)] p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--vv-gold)]">{t.id}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            t.status === "Open" ? "bg-green-500/10 text-green-400" : "bg-[var(--vv-text-muted)]/10 text-[var(--vv-text-muted)]"
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--vv-text)]">{t.subject}</p>
                      <p className="text-xs text-[var(--vv-text-dim)]">{t.updated}</p>
                    </div>
                  ))}
                </div>
                <button className="mt-3 w-full rounded-md border border-[var(--vv-border)] py-2 text-xs font-medium text-[var(--vv-text)] transition-colors hover:bg-[var(--vv-bg)]">
                  New ticket
                </button>
              </div>

              <div className="rounded-xl border border-[var(--vv-border)] bg-[var(--vv-card)] p-5">
                <h3 className="mb-1 text-sm font-bold text-[var(--vv-text)]">Support hours</h3>
                <p className="text-xs text-[var(--vv-text-muted)]">
                  Monday – Friday
                  <br />
                  09:00 – 18:00 CET
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
