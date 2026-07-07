import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="flex h-full w-full items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-mono">{t("notFound.title")}</h1>
        <p className="text-muted-foreground">{t("notFound.description")}</p>
        <Link href="/" className="inline-block mt-4 text-primary hover:underline">
          {t("notFound.returnHome")}
        </Link>
      </div>
    </div>
  );
}