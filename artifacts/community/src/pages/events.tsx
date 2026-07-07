import { useListEvents, getListEventsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { nl, fr } from "date-fns/locale";
import { MapPin, Clock, ArrowUpRight, CalendarDays } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function EventsPage() {
  const { data: events } = useListEvents({ query: { queryKey: getListEventsQueryKey() } });
  const { t, language } = useI18n();

  const dateLocale = language === "fr" ? fr : nl;

  // Group by month
  const grouped = events?.reduce((acc, event) => {
    if (!event.date) return acc;
    const key = format(new Date(event.date), "MMMM yyyy", { locale: dateLocale });
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {} as Record<string, NonNullable<typeof events>>);

  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <div className="border-b border-border pb-8 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">{t("nav.events")}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {t("events.title")}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
            {t("events.subtitle")}
          </p>
          <a
            href="https://vectorvest.eu/events"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium mt-1"
          >
            {t("events.viewAll")} <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Event list */}
        {grouped && Object.entries(grouped).length > 0 ? (
          <div className="space-y-10">
            {Object.entries(grouped).map(([month, monthEvents]) => (
              <div key={month} className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                  {month}
                </h2>
                <div className="space-y-3">
                  {monthEvents.map(event => (
                    <div
                      key={event.id}
                      className="group flex gap-0 border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors bg-card"
                    >
                      {/* Date block */}
                      <div className="w-20 sm:w-24 bg-sidebar border-r border-border flex flex-col items-center justify-center py-5 shrink-0">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                          {format(new Date(event.date!), "MMM", { locale: dateLocale })}
                        </span>
                        <span className="text-3xl font-black font-mono mt-0.5 leading-none">
                          {format(new Date(event.date!), "dd")}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 px-5 py-4 min-w-0 relative">
                        <h3 className="font-bold text-base leading-snug mb-2">{event.title}</h3>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(event.date!), "HH:mm")}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-border rounded-lg">
            <CalendarDays className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-semibold mb-1">{t("events.noEvents")}</p>
            <p className="text-muted-foreground text-sm">{t("events.checkBackLater")}</p>
          </div>
        )}

        {/* Footer link */}
        <div className="pt-4 border-t border-border text-center">
          <a
            href="https://vectorvest.eu/events"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t("events.viewAll")} <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
