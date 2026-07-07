import { useState } from "react";
import { cn } from "@/lib/utils";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SupportTicket() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [sent, setSent] = useState(false);
  const { t, language } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !question.trim()) return;

    const subject = encodeURIComponent(t("supportTicket.subject"));
    const body = encodeURIComponent(
      `${t("supportTicket.from")} ${email}\n\n${t("supportTicket.question")}\n${question}\n\n---\n${t("supportTicket.sentFrom")}`,
    );
    window.location.href = `mailto:support@vectorvest.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{t("supportTicket.title")}</h2>
            <p className="text-xs text-muted-foreground">{t("supportTicket.replyByEmail")}</p>
          </div>
        </div>

        {sent ? (
          <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-center">
            <MessageSquare className="mx-auto mb-2 h-6 w-6 text-primary" />
            <h3 className="mb-1 text-sm font-bold text-foreground">{t("supportTicket.draftOpened")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("supportTicket.emailFallback")}{" "}
              <a href="mailto:support@vectorvest.com" className="text-primary underline">
                support@vectorvest.com
              </a>.
            </p>
            <div className="mt-3 rounded-md border border-border bg-background p-3 text-left text-xs text-muted-foreground">
              <p className="font-medium text-foreground">{t("supportTicket.from")}</p>
              <p className="mb-2">{email}</p>
              <p className="font-medium text-foreground">{t("supportTicket.question")}</p>
              <p className="whitespace-pre-wrap">{question}</p>
            </div>
            <button
              onClick={() => { setSent(false); setQuestion(""); }}
              className="mt-4 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              {t("supportTicket.sendAnother")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="support-email" className="mb-1 block text-xs font-medium text-foreground">
                {t("supportTicket.yourEmail")}
              </label>
              <input
                id="support-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("supportTicket.emailPlaceholder")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="support-question" className="mb-1 block text-xs font-medium text-foreground">
                {t("supportTicket.yourQuestion")}
              </label>
              <textarea
                id="support-question"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t("supportTicket.questionPlaceholder")}
                rows={5}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={!email.trim() || !question.trim()}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors",
                (!email.trim() || !question.trim()) && "opacity-50 cursor-not-allowed",
              )}
            >
              <Send className="h-4 w-4" />
              {t("supportTicket.openTicket")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
