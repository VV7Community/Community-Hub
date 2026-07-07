import { useListWebinars, getListWebinarsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { nl, fr } from "date-fns/locale";
import {
  Play, Calendar as CalendarIcon, Clock, Users, Radio,
  StopCircle, Video, Mic, MicOff, Subtitles, ExternalLink, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useState, useEffect, useRef } from "react";

const BASE = import.meta.env.BASE_URL;

async function patchWebinar(id: number, body: Record<string, unknown>) {
  return fetch(`${BASE}api/webinars/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export default function WebinarPage() {
  const { data: webinars, refetch } = useListWebinars({ query: { queryKey: getListWebinarsQueryKey() } });
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { t, language } = useI18n();
  const queryClient = useQueryClient();

  const [subtitlesOn, setSubtitlesOn] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recordingInput, setRecordingInput] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const recognitionRef = useRef<any>(null);

  const isAdmin = me?.role === "admin";
  const dateLocale = language === "fr" ? fr : nl;

  const liveWebinar = webinars?.find(w => w.status === "live");
  const upcomingWebinars = webinars?.filter(w => w.status === "upcoming")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()) || [];
  const pastWebinars = webinars?.filter(w => w.status === "past")
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()) || [];
  const mainWebinar = liveWebinar || upcomingWebinars[0] || null;

  // Web Speech API subtitles
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (subtitlesOn) {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = language === "fr" ? "fr-FR" : "nl-NL";
      rec.onresult = (e: any) => {
        const last = e.results[e.results.length - 1];
        setTranscript(last[0].transcript);
      };
      rec.onerror = () => setSubtitlesOn(false);
      rec.start();
      recognitionRef.current = rec;
    } else {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setTranscript("");
    }
    return () => { recognitionRef.current?.stop(); };
  }, [subtitlesOn, language]);

  async function goLive(id: number) {
    await patchWebinar(id, { status: "live" });
    queryClient.invalidateQueries({ queryKey: getListWebinarsQueryKey() });
  }

  async function endStream(id: number) {
    await patchWebinar(id, { status: "past" });
    queryClient.invalidateQueries({ queryKey: getListWebinarsQueryKey() });
  }

  async function saveRecording(id: number) {
    const url = recordingInput[id];
    if (!url) return;
    setSaving(s => ({ ...s, [id]: true }));
    await patchWebinar(id, { recordingUrl: url, recordingStatus: "ready" });
    queryClient.invalidateQueries({ queryKey: getListWebinarsQueryKey() });
    setSaving(s => ({ ...s, [id]: false }));
  }

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">

      {/* Left chat panel — hidden on mobile */}
      <div className="hidden md:flex w-64 bg-sidebar border-r border-border flex-col shrink-0">
        <div className="h-14 border-b border-border flex items-center px-4 shrink-0">
          <h2 className="font-semibold text-sm tracking-wide uppercase text-muted-foreground">{t("webinar.liveChat")}</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center text-muted-foreground border-b border-border">
          <div>
            <Users className="w-7 h-7 mx-auto mb-3 opacity-30" />
            <p className="text-xs leading-relaxed">{t("webinar.chatDuringLive")}</p>
          </div>
        </div>
        {/* Up next sidebar */}
        <div className="p-4 flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("webinar.upNext")}</p>
          <ScrollArea className="max-h-48">
            <div className="space-y-2">
              {upcomingWebinars.slice(0, 4).map(w => (
                <div key={w.id} className="border border-border bg-card/50 p-3 rounded">
                  <p className="text-[11px] text-primary font-mono mb-1">
                    {format(new Date(w.scheduledAt), "d MMM · HH:mm", { locale: dateLocale })}
                  </p>
                  <p className="text-xs font-medium leading-snug line-clamp-2">{w.title}</p>
                </div>
              ))}
              {upcomingWebinars.length === 0 && (
                <p className="text-xs text-muted-foreground">{t("webinar.noUpcoming")}</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-10">

          {/* ── Main video block ── */}
          {mainWebinar ? (
            <div className="space-y-5">
              {/* Video / Jitsi area */}
              <div className="relative aspect-video bg-black rounded-lg border border-border overflow-hidden">
                {mainWebinar.status === "live" ? (
                  <>
                    <iframe
                      src={`https://meet.jit.si/vectorvest-${mainWebinar.roomName || mainWebinar.id}`}
                      allow="camera; microphone; fullscreen; display-capture; autoplay"
                      className="w-full h-full border-0"
                      title={mainWebinar.title}
                    />
                    {/* Live badge */}
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-2 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      {t("webinar.liveNow")}
                    </div>
                    {/* Subtitle bar */}
                    {subtitlesOn && transcript && (
                      <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white text-sm px-4 py-2 rounded text-center leading-relaxed">
                        {transcript}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {mainWebinar.thumbnailUrl && (
                      <img
                        src={mainWebinar.thumbnailUrl}
                        alt={mainWebinar.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-7 h-7 ml-1" fill="currentColor" />
                      </div>
                      <div className="bg-background/80 backdrop-blur-sm border border-border px-5 py-2 rounded text-sm font-mono text-center">
                        {t("webinar.starts", { date: format(new Date(mainWebinar.scheduledAt), "d MMMM 'om' HH:mm", { locale: dateLocale }) })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Webinar info row */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2 leading-tight">
                    {mainWebinar.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {format(new Date(mainWebinar.scheduledAt), "d MMMM yyyy", { locale: dateLocale })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {format(new Date(mainWebinar.scheduledAt), "HH:mm")}
                    </span>
                    <span className="text-muted-foreground">
                      {t("webinar.hostedBy")} <strong className="text-foreground">{mainWebinar.hostName}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Subtitles toggle (live only) */}
                  {mainWebinar.status === "live" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSubtitlesOn(v => !v)}
                      className={cn(subtitlesOn && "border-primary text-primary")}
                    >
                      <Subtitles className="w-4 h-4 mr-1.5" />
                      {subtitlesOn ? t("webinar.disableSubtitles") : t("webinar.enableSubtitles")}
                    </Button>
                  )}
                  <Button size="sm" className="font-semibold">
                    {mainWebinar.status === "live"
                      ? t("webinar.joinLive")
                      : t("webinar.setReminder")}
                  </Button>
                </div>
              </div>

              {mainWebinar.description && (
                <p className="text-foreground/70 text-sm leading-relaxed border-t border-border pt-4">
                  {mainWebinar.description}
                </p>
              )}

              {/* Admin host controls */}
              {isAdmin && (
                <div className="border border-border rounded-lg p-4 bg-card/50 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5" /> {t("webinar.hostControls")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mainWebinar.status === "upcoming" && (
                      <Button size="sm" onClick={() => goLive(mainWebinar.id)} className="bg-red-600 hover:bg-red-700 text-white">
                        <Video className="w-3.5 h-3.5 mr-1.5" /> {t("webinar.goLive")}
                      </Button>
                    )}
                    {mainWebinar.status === "live" && (
                      <Button size="sm" variant="outline" onClick={() => endStream(mainWebinar.id)}>
                        <StopCircle className="w-3.5 h-3.5 mr-1.5" /> {t("webinar.endStream")}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-muted/30 border border-border rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground text-sm">{t("webinar.noWebinars")}</p>
            </div>
          )}

          {/* ── Upcoming webinars ── */}
          {upcomingWebinars.length > (mainWebinar?.status === "upcoming" ? 1 : 0) && (
            <div className="space-y-4 border-t border-border pt-8">
              <h2 className="font-display text-xl font-bold">{t("webinar.upcomingWebinars")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingWebinars
                  .filter(w => w.id !== mainWebinar?.id)
                  .map(w => (
                    <div key={w.id} className="flex gap-4 border border-border rounded-lg p-4 bg-card hover:border-primary/40 transition-colors">
                      <div className="shrink-0 w-12 text-center">
                        <p className="text-[11px] font-bold text-primary uppercase tracking-wide">
                          {format(new Date(w.scheduledAt), "MMM", { locale: dateLocale })}
                        </p>
                        <p className="text-2xl font-black font-mono leading-tight">
                          {format(new Date(w.scheduledAt), "dd")}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm leading-snug line-clamp-2 mb-1">{w.title}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {format(new Date(w.scheduledAt), "HH:mm")} · {w.hostName}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── Past sessions / recordings ── */}
          {pastWebinars.length > 0 && (
            <div className="space-y-5 border-t border-border pt-8">
              <h2 className="font-display text-xl font-bold">{t("webinar.pastSessions")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {pastWebinars.map(w => (
                  <div key={w.id} className="group border border-border rounded-lg overflow-hidden bg-card hover:border-primary/40 transition-colors flex flex-col">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-muted relative overflow-hidden shrink-0">
                      {w.thumbnailUrl ? (
                        <img src={w.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                      {(w as any).recordingUrl && (
                        <a
                          href={(w as any).recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 ml-0.5 text-primary-foreground" fill="currentColor" />
                          </div>
                        </a>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        {(w as any).recordingUrl ? t("webinar.recordings") : t("webinar.replay")}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="font-semibold text-sm leading-snug mb-1 line-clamp-2">{w.title}</p>
                      <p className="text-xs text-muted-foreground font-mono mb-3">
                        {format(new Date(w.scheduledAt), "d MMM yyyy", { locale: dateLocale })} · {w.hostName}
                      </p>

                      {(w as any).recordingUrl ? (
                        <a
                          href={(w as any).recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto text-xs text-primary flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> {t("webinar.watchRecording")}
                        </a>
                      ) : (
                        <p className="text-xs text-muted-foreground/50 mt-auto">{t("webinar.noRecordings")}</p>
                      )}

                      {/* Admin: add recording URL */}
                      {isAdmin && !(w as any).recordingUrl && (
                        <div className="mt-3 flex gap-2 border-t border-border pt-3">
                          <input
                            type="url"
                            placeholder={t("webinar.recordingUrlPlaceholder")}
                            value={recordingInput[w.id] ?? ""}
                            onChange={e => setRecordingInput(prev => ({ ...prev, [w.id]: e.target.value }))}
                            className="flex-1 text-xs bg-input border border-border rounded px-2 py-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-auto"
                            disabled={saving[w.id]}
                            onClick={() => saveRecording(w.id)}
                          >
                            {t("webinar.saveRecording")}
                          </Button>
                        </div>
                      )}
                    </div>
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
