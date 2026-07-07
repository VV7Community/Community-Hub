import { BrandLogo } from "@/components/brand/BrandLogo";
import { ShieldCheck, TrendingUp, Users } from "lucide-react";

const HIGHLIGHTS = [
  { icon: TrendingUp, title: "Dagelijkse marktsignalen", body: "ColorGuard, MTI en Primary Wave — elke handelsdag." },
  { icon: Users, title: "Actieve community", body: "Deel aandelen, UniSearch-recepten en stel je vragen." },
  { icon: ShieldCheck, title: "Exclusief voor klanten", body: "Enkel geverifieerde VectorVest-abonnees krijgen toegang." },
];

/**
 * Split-screen auth shell: an editorial navy brand panel (desktop) beside the
 * Clerk form. Keeps the sign-in/up experience on-brand and balanced instead of
 * a lone card floating on an empty background.
 */
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full lg:grid lg:grid-cols-[1.05fr_1fr] bg-background">
      {/* ── Brand panel — desktop only ─────────────────────────────── */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 xl:p-16">
        {/* Layered navy background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(237_54%_16%)] via-[hsl(237_57%_12%)] to-[hsl(237_60%_9%)]" />
        {/* Diagonal motif echoing the logo's white slash */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            background:
              "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 26px)",
          }}
        />
        <div
          className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle at 30% 70%, hsl(38 52% 57%) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -top-24 -right-24 h-[460px] w-[460px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle at 70% 30%, hsl(237 70% 34%) 0%, transparent 70%)" }}
        />

        <div className="relative z-10">
          <BrandLogo size="lg" tagline="Community · België & Nederland" />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight text-white">
            De thuisbasis voor{" "}
            <span className="text-primary">serieuze beleggers</span>.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/60">
            Realtime discussie, wekelijkse webinars en dagelijkse VectorVest-analyses —
            alles op één plek, exclusief voor de BE/NL community.
          </p>

          <ul className="mt-10 space-y-5">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <h.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-white">{h.title}</p>
                  <p className="text-sm text-white/50">{h.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-xs font-medium tracking-wide text-white/30">
          <span>37 JAAR ERVARING</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>1M+ BELEGGERS WERELDWIJD</span>
        </div>
      </aside>

      {/* ── Form panel ─────────────────────────────────────────────── */}
      <main className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 py-10 lg:min-h-full">
        {/* Subtle glow behind form on mobile / narrow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute -top-32 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        {/* Mobile brand lockup (brand panel hidden below lg) */}
        <div className="relative z-10 mb-8 flex flex-col items-center lg:hidden">
          <BrandLogo size="md" tagline="Community · BE & NL" />
        </div>

        <div className="relative z-10 w-full max-w-[420px]">{children}</div>
      </main>
    </div>
  );
}
