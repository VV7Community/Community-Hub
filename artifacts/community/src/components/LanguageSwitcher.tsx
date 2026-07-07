import { useI18n } from "@/lib/i18n";

interface LanguageSwitcherProps {
  variant?: "buttons" | "compact";
}

export function LanguageSwitcher({ variant = "buttons" }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useI18n();

  if (variant === "compact") {
    return (
      <div className="flex items-center rounded-md border border-border bg-background p-0.5 text-xs">
        <button
          type="button"
          onClick={() => setLanguage("nl")}
          className={`px-2 py-1 rounded-sm font-medium transition-colors ${
            language === "nl" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          NL
        </button>
        <button
          type="button"
          onClick={() => setLanguage("fr")}
          className={`px-2 py-1 rounded-sm font-medium transition-colors ${
            language === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          FR
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setLanguage("nl")}
        className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
          language === "nl" ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"
        }`}
      >
        {t("language.nl")}
      </button>
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
          language === "fr" ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"
        }`}
      >
        {t("language.fr")}
      </button>
    </div>
  );
}
