import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Languages } from "lucide-react";

interface MessageTranslationProps {
  text: string;
}

export function MessageTranslation({ text }: MessageTranslationProps) {
  const { language, t } = useI18n();
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleTranslate = async () => {
    if (translated) return;
    setLoading(true);
    setError(false);
    try {
      const source = language === "nl" ? "fr" : "nl";
      const res = await fetch(`${import.meta.env.BASE_URL}api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage: language, sourceLanguage: source }),
      });
      if (!res.ok) throw new Error("Translation failed");
      const data = await res.json();
      setTranslated(data.translatedText ?? text);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-1">
      {translated ? (
        <div className="rounded-md border border-primary/20 bg-primary/5 p-2 text-sm text-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{language === "nl" ? "NL" : "FR"}</span>
          <p className="mt-0.5">{translated}</p>
        </div>
      ) : (
        <button
          onClick={handleTranslate}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          <Languages className="h-3 w-3" />
          {loading ? "…" : language === "nl" ? t("chat.translateToNL") : t("chat.translateToFR")}
        </button>
      )}
      {error && <p className="mt-1 text-xs text-destructive">{t("chat.translationFailed")}</p>}
    </div>
  );
}
