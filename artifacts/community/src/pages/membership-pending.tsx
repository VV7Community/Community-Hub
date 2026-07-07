import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useClerk } from "@/lib/clerk";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/BrandLogo";
import { Loader2, Clock3, XCircle, LogOut } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function MembershipPendingPage() {
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey(), refetchInterval: 15000 } });
  const { signOut } = useClerk();
  const { t } = useI18n();

  const isRejected = me?.membershipStatus === "rejected";

  return (
    <div className="min-h-[100dvh] w-full bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center space-y-5">
        <LogoMark className="w-16 h-16 mx-auto" />

        {isRejected ? (
          <>
            <XCircle className="w-10 h-10 text-destructive mx-auto" />
            <h1 className="text-xl font-bold">{t("membership.rejectedTitle")}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("membership.rejectedDescription")}
            </p>
          </>
        ) : (
          <>
            <Clock3 className="w-10 h-10 text-primary mx-auto animate-pulse" />
            <h1 className="text-xl font-bold">{t("membership.pendingTitle")}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("membership.pendingDescription")}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {t("membership.autoUpdate")}
            </div>
          </>
        )}

        <div className="pt-2 border-t border-border space-y-3">
          <p className="text-xs text-muted-foreground">
            {t("membership.notCustomer")}{" "}
            <a href="https://vectorvest.eu" target="_blank" rel="noreferrer" className="text-primary hover:underline">
              {t("membership.learnMore")}
            </a>
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("membership.signOut")}
          </Button>
        </div>
      </div>
    </div>
  );
}
