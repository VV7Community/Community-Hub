import { useListWebinars, getListWebinarsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Play, Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function WebinarPage() {
  const { data: webinars } = useListWebinars({ query: { queryKey: getListWebinarsQueryKey() } });

  const liveWebinar = webinars?.find(w => w.status === "live");
  const upcomingWebinars = webinars?.filter(w => w.status === "upcoming").sort((a, b) =>
    new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  ) || [];
  const pastWebinars = webinars?.filter(w => w.status === "past") || [];
  const mainWebinar = liveWebinar || upcomingWebinars[0] || pastWebinars[0];

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">

      {/* Left panel — hidden on mobile */}
      <div className="hidden md:flex w-72 bg-sidebar border-r border-border flex-col shrink-0">
        <div className="h-14 border-b border-border flex items-center px-4 shrink-0">
          <h2 className="font-bold">Live Chat</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground border-b border-border">
          <div>
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Chat is available during live sessions.</p>
          </div>
        </div>
        <div className="h-64 p-4 flex flex-col gap-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Up Next</h3>
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              {upcomingWebinars.slice(0, 3).map(w => (
                <div key={w.id} className="bg-card border border-border p-3 rounded-lg">
                  <div className="text-xs text-primary font-mono mb-1">
                    {format(new Date(w.scheduledAt), "MMM d, h:mm a")}
                  </div>
                  <h4 className="font-semibold text-sm line-clamp-2 leading-tight">{w.title}</h4>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">

          {/* Upcoming on mobile — shown above video */}
          {upcomingWebinars.length > 0 && (
            <div className="md:hidden">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Up Next</h3>
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {upcomingWebinars.slice(0, 4).map(w => (
                  <div key={w.id} className="bg-card border border-border p-3 rounded-lg shrink-0 w-52">
                    <div className="text-xs text-primary font-mono mb-1">
                      {format(new Date(w.scheduledAt), "MMM d, h:mm a")}
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2 leading-tight">{w.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mainWebinar ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Video player */}
              <div className="aspect-video bg-black rounded-xl border border-border flex items-center justify-center relative overflow-hidden group">
                {mainWebinar.thumbnailUrl && (
                  <img
                    src={mainWebinar.thumbnailUrl}
                    alt={mainWebinar.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
                  />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" fill="currentColor" />
                  </div>
                  {mainWebinar.status === "upcoming" && (
                    <div className="mt-4 sm:mt-6 bg-background/80 backdrop-blur-sm border border-border px-4 py-2 rounded-full font-mono text-xs sm:text-sm text-center">
                      Starts {format(new Date(mainWebinar.scheduledAt), "MMMM d 'at' h:mm a")}
                    </div>
                  )}
                </div>
                {mainWebinar.status === "live" && (
                  <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 uppercase tracking-wider animate-pulse">
                    <div className="w-2 h-2 bg-current rounded-full" />
                    Live Now
                  </div>
                )}
              </div>

              {/* Webinar info */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{mainWebinar.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 shrink-0" />
                        {format(new Date(mainWebinar.scheduledAt), "MMMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 shrink-0" />
                        {format(new Date(mainWebinar.scheduledAt), "h:mm a")}
                      </span>
                      <span>Hosted by <strong className="text-foreground">{mainWebinar.hostName}</strong></span>
                    </div>
                  </div>
                  <Button size="lg" className="shrink-0 font-bold w-full sm:w-auto">
                    {mainWebinar.status === "past" ? "Watch Replay" : "Set Reminder"}
                  </Button>
                </div>
                <p className="text-foreground/80 leading-relaxed">{mainWebinar.description}</p>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground">No webinars scheduled.</p>
            </div>
          )}

          {/* Past webinars grid */}
          {pastWebinars.length > 0 && (
            <div className="space-y-4 pt-6 sm:pt-8 border-t border-border">
              <h3 className="text-xl font-bold">Past Sessions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {pastWebinars.map(w => (
                  <div key={w.id} className="group cursor-pointer">
                    <div className="aspect-video bg-muted rounded-lg border border-border mb-3 relative overflow-hidden">
                      {w.thumbnailUrl && (
                        <img src={w.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <Play className="w-10 h-10 text-white" fill="currentColor" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono">
                        Replay
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">{w.title}</h4>
                    <p className="text-xs text-muted-foreground">{format(new Date(w.scheduledAt), "MMM d, yyyy")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
