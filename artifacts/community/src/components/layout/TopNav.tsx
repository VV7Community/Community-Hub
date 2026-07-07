import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { MessageSquare, Video, BookOpen, Calendar, UserCircle, Headphones, ShieldCheck } from "lucide-react";
import { useClerk } from "@/lib/clerk";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function TopNav() {
  const [location] = useLocation();
  const { user } = useClerk();
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { t } = useI18n();

  const navItems = [
    { label: t("nav.mainRoom"), path: "/room/chat", icon: MessageSquare, activeMatches: ["/room"] },
    { label: t("nav.webinar"), path: "/webinar", icon: Video, activeMatches: ["/webinar"] },
    { label: t("nav.university"), path: "/university", icon: BookOpen, activeMatches: ["/university"] },
    { label: t("nav.events"), path: "/events", icon: Calendar, activeMatches: ["/events"] },
    { label: t("nav.support"), path: "/support", icon: Headphones, activeMatches: ["/support"] },
    { label: t("nav.account"), path: "/account", icon: UserCircle, activeMatches: ["/account"] },
  ];

  return (
    <nav className="h-14 border-b border-sidebar-border bg-sidebar px-4 flex items-center shrink-0 shadow-lg z-20 relative">
      {/* Brand mark */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
        <BrandLogo size="sm" />
        <span className="text-[10px] font-semibold tracking-widest text-primary/70 uppercase mt-0.5 hidden lg:block border-l border-sidebar-border pl-2.5 ml-0.5">
          {t("nav.brandRegion")}
        </span>
      </Link>

      {/* Divider — desktop only */}
      <div className="w-px h-6 bg-sidebar-border mx-6 hidden md:block" />

      {/* Nav tabs — hidden on mobile (BottomNav takes over) */}
      <div className="hidden md:flex gap-0.5 h-full flex-1">
        {navItems.map((item) => {
          const isActive = item.activeMatches.some(m => location.startsWith(m));
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative flex items-center gap-2 px-3 h-full text-sm font-medium transition-all hover:text-foreground",
                isActive
                  ? "text-primary after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground/80 hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Spacer on mobile */}
      <div className="flex-1 md:hidden" />

      {/* User avatar — always visible */}
      {user && (
        <div className="flex items-center gap-2 shrink-0">
          {me?.role === "admin" && (
            <Link
              href="/admin/members"
              title={t("nav.memberVerification")}
              className={cn(
                "hidden sm:flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                location.startsWith("/admin")
                  ? "text-primary bg-primary/10"
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground/80 hover:bg-white/5"
              )}
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          )}
          <span className="text-xs font-medium text-sidebar-foreground/60 hidden md:block">
            {user.username || user.firstName}
          </span>
          <div className="block">
            <LanguageSwitcher variant="compact" />
          </div>
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={t("common.avatar")}
              className="w-8 h-8 rounded-full border-2 border-primary/30 shadow"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-primary/30 shadow bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {(user.username || user.firstName || "?").slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
