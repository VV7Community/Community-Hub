import { useParams } from "wouter";
import { FileText, File, FolderOpen, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";

export function ResourceView() {
  const params = useParams();
  const resourceId = params.resourceId || "";
  const { t, language } = useI18n();

  const RESOURCES: Record<string, { title: string; icon: React.ElementType; items: { name: string; description: string }[] }> = {
    slides: {
      title: t("resources.slides"),
      icon: FileText,
      items: [
        { name: language === "fr" ? "Introduction à VectorVest 7" : language === "nl" ? "Introductie tot VectorVest 7" : "VectorVest 7 Introductie", description: t("resources.slideIntro") },
        { name: language === "fr" ? "ColorGuard & MTI" : "ColorGuard & MTI", description: t("resources.slideColorGuard") },
        { name: language === "fr" ? "Workshop UniSearch" : language === "nl" ? "UniSearch Workshop" : "UniSearch Workshop", description: t("resources.slideUniSearch") },
      ],
    },
    files: {
      title: t("resources.files"),
      icon: File,
      items: [
        { name: language === "fr" ? "Aide-mémoire RV/RS/VST" : language === "nl" ? "RV/RS/VST overzicht" : "RV/RS/VST Cheat Sheet", description: t("resources.fileCheatSheet") },
        { name: language === "fr" ? "Modèle de watchlist" : language === "nl" ? "Watchlist-sjabloon" : "Watchlist Template", description: t("resources.fileWatchlist") },
        { name: language === "fr" ? "Checklist stratégique" : language === "nl" ? "Strategie-checklist" : "Strategy Checklist", description: t("resources.fileChecklist") },
      ],
    },
  };

  const resource = RESOURCES[resourceId];

  if (!resource) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <p className="text-muted-foreground">{t("resources.notFound")}</p>
        <Link href="/room/chat" className="mt-4 text-primary hover:underline">
          <ArrowLeft className="mr-1 inline h-4 w-4" /> {t("resources.backToChat")}
        </Link>
      </div>
    );
  }

  const Icon = resource.icon;

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">{resource.title}</h2>
          <p className="text-xs text-muted-foreground">{t("resources.subtitle")}</p>
        </div>
      </div>

      {resource.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
          <FolderOpen className="mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">{t("resources.noResources")}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resource.items.map((item) => (
            <div
              key={item.name}
              className="flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
              <button className="mt-4 w-full rounded-md bg-primary py-1.5 text-xs font-semibold text-primary-foreground">
                {t("resources.open")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
