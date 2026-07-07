import { Mail, Phone, ExternalLink, Shield } from "lucide-react";

interface ContactCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  description: string;
  external?: boolean;
}

function ContactCard({ icon, label, value, href, description, external }: ContactCardProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all active:scale-[0.98]"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
        <p className="font-bold text-foreground text-lg leading-tight truncate">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0" />
    </a>
  );
}

export default function SupportPage() {
  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Support</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Reach the VectorVest Europe team — we're here to help.
          </p>
        </div>

        {/* Contact options */}
        <div className="space-y-3">
          <ContactCard
            icon={<Mail className="w-6 h-6" />}
            label="Email"
            value="belgium@vectorvest.com"
            href="mailto:belgium@vectorvest.com"
            description="Send us a message — we reply within 1 business day"
          />
          <ContactCard
            icon={<Phone className="w-6 h-6" />}
            label="Freephone"
            value="0800 261 88"
            href="tel:080026188"
            description="Free from Belgium — Mon–Fri, 9:00–17:00"
          />
          <ContactCard
            icon={<ExternalLink className="w-6 h-6" />}
            label="Platform"
            value="anywhere.vectorvest.com"
            href="https://anywhere.vectorvest.com"
            description="Access VectorVest from any browser"
            external
          />
        </div>

        {/* GDPR section */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground mb-0.5">Privacy &amp; GDPR Preferences</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Manage your data and consent settings in line with EU privacy regulation.
            </p>
          </div>
          <a
            href="mailto:belgium@vectorvest.com?subject=GDPR%20Request"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted hover:border-primary/40 transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            <Shield className="w-4 h-4 text-muted-foreground" />
            GDPR Request
          </a>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground/50 pb-2">
          VectorVest Europe · Registered in Belgium
        </p>

      </div>
    </div>
  );
}
