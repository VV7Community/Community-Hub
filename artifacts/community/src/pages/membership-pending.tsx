import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useClerk } from "@/lib/clerk";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/BrandLogo";
import { Loader2, Clock3, XCircle, LogOut } from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function MembershipPendingPage() {
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey(), refetchInterval: 15000 } });
  const { signOut } = useClerk();

  const isRejected = me?.membershipStatus === "rejected";

  return (
    <div className="min-h-[100dvh] w-full bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center space-y-5">
        <LogoMark className="w-16 h-16 mx-auto" />

        {isRejected ? (
          <>
            <XCircle className="w-10 h-10 text-destructive mx-auto" />
            <h1 className="text-xl font-bold">We couldn't verify your VectorVest membership</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The email address on this account doesn't match an active VectorVest Europe
              subscription. If you believe this is a mistake, contact support and we'll take
              another look.
            </p>
          </>
        ) : (
          <>
            <Clock3 className="w-10 h-10 text-primary mx-auto animate-pulse" />
            <h1 className="text-xl font-bold">Verifying your VectorVest membership</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This community room is exclusive to VectorVest Europe customers. We're checking
              that the email on this account matches an active subscription — this usually
              takes a moment, but can take longer if it needs a manual check.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              This page updates automatically
            </div>
          </>
        )}

        <div className="pt-2 border-t border-border space-y-3">
          <p className="text-xs text-muted-foreground">
            Not a VectorVest Europe customer yet?{" "}
            <a href="https://vectorvest.eu" target="_blank" rel="noreferrer" className="text-primary hover:underline">
              Learn more at vectorvest.eu
            </a>
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
