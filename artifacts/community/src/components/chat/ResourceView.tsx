import { useParams } from "wouter";
import { FileText, File, FolderOpen, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const RESOURCES: Record<string, { title: string; icon: React.ElementType; items: { name: string; description: string }[] }> = {
  slides: {
    title: "Slides",
    icon: FileText,
    items: [
      { name: "VectorVest 7 Introductie", description: "Basisprincipes van VectorVest in 20 slides." },
      { name: "ColorGuard & MTI", description: "Hoe de markttiming-indicators werken." },
      { name: "UniSearch Workshop", description: "Slides van de laatste UniSearch-sessie." },
    ],
  },
  files: {
    title: "Files",
    icon: File,
    items: [
      { name: "RV/RS/VST Cheat Sheet", description: "Snelle referentiegids voor VectorVest-scores." },
      { name: "Watchlist Template", description: "CSV-template om je eigen watchlist te importeren." },
      { name: "Strategy Checklist", description: "PDF met een checklist voor elke strategie." },
    ],
  },
};

export function ResourceView() {
  const params = useParams();
  const resourceId = params.resourceId || "";
  const resource = RESOURCES[resourceId];

  if (!resource) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <p className="text-muted-foreground">Resource not found.</p>
        <Link href="/room/chat" className="mt-4 text-primary hover:underline">
          <ArrowLeft className="mr-1 inline h-4 w-4" /> Back to chat
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
          <p className="text-xs text-muted-foreground">Resources van de VectorVest-community.</p>
        </div>
      </div>

      {resource.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
          <FolderOpen className="mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No resources uploaded yet.</p>
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
                Open
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
