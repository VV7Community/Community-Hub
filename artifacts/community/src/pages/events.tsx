import { useListEvents, getListEventsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { MapPin, CalendarDays, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export default function EventsPage() {
  const { data: events } = useListEvents({ query: { queryKey: getListEventsQueryKey() }});
  const { t } = useI18n();

  // Group events by month; events without a date are treated as on-demand
  const groupedEvents = events?.reduce((acc, event) => {
    if (!event.date) return acc;
    const month = format(new Date(event.date), "MMMM yyyy");
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  const onDemandEvents = events?.filter((e) => !e.date) ?? [];

  return (
    <div className="h-full w-full overflow-y-auto bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("events.title")}</h1>
          <p className="text-muted-foreground">{t("events.subtitle")}</p>
        </div>

        <div className="space-y-12">
          {groupedEvents && Object.entries(groupedEvents).map(([month, monthEvents]) => (
            <div key={month} className="space-y-6">
              <h2 className="text-xl font-bold border-b border-border pb-2 text-primary">{month}</h2>
              
              <div className="space-y-4">
                {monthEvents.map(event => (
                  <div key={event.id} className="group bg-card border border-border rounded-xl p-0 flex flex-col sm:flex-row overflow-hidden hover:border-primary/50 transition-colors">
                    
                    {/* Date Block */}
                    <div className="bg-sidebar border-b sm:border-b-0 sm:border-r border-border p-6 flex flex-col items-center justify-center min-w-[120px] shrink-0">
                      <span className="text-sm font-bold text-primary uppercase tracking-widest">{format(new Date(event.date), "MMM")}</span>
                      <span className="text-4xl font-black font-mono mt-1">{format(new Date(event.date), "dd")}</span>
                    </div>
                    
                    {/* Content Block */}
                    <div className="p-6 flex-1 flex flex-col justify-center relative">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-background">{event.type || t("events.event")}</Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 max-w-2xl">{event.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mt-auto">
                        <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md"><Clock className="w-3.5 h-3.5" /> {format(new Date(event.date), "h:mm a")}</span>
                        {event.location && (
                          <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                        )}
                      </div>
                      
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden sm:block">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {onDemandEvents.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-border pb-2 text-primary">{t("events.onDemand")}</h2>
              <div className="space-y-4">
                {onDemandEvents.map(event => (
                  <div key={event.id} className="group bg-card border border-border rounded-xl p-0 flex flex-col sm:flex-row overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="bg-sidebar border-b sm:border-b-0 sm:border-r border-border p-6 flex flex-col items-center justify-center min-w-[120px] shrink-0">
                      <span className="text-sm font-bold text-primary uppercase tracking-widest">{t("events.any")}</span>
                      <span className="text-4xl font-black font-mono mt-1">—</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-center relative">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-background">{event.type || t("events.event")}</Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 max-w-2xl">{event.description}</p>
                      {event.location && (
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mt-auto">
                          <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!events || events.length === 0) && (
            <div className="py-20 text-center border border-dashed border-border rounded-xl">
              <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-1">{t("events.noEvents")}</h3>
              <p className="text-muted-foreground">{t("events.checkBackLater")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
