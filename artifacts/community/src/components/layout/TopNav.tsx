import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { MessageSquare, Video, BookOpen, Calendar, UserCircle, Headphones } from "lucide-react";
import { useClerk } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const navItems = [
  { label: "Main Room",  path: "/room/main-chat", icon: MessageSquare, activeMatches: ["/room"] },
  { label: "Webinar",    path: "/webinar",         icon: Video,         activeMatches: ["/webinar"] },
  { label: "University", path: "/university",      icon: BookOpen,      activeMatches: ["/university"] },
  { label: "Events",     path: "/events",          icon: Calendar,      activeMatches: ["/events"] },
  { label: "Support",    path: "/support",         icon: Headphones,    activeMatches: ["/support"] },
  { label: "Account",    path: "/account",         icon: UserCircle,    activeMatches: ["/account"] },
];

export function TopNav() {
  const [location] = useLocation();
  const { user } = useClerk();

  return (
    <nav className="h-14 border-b border-sidebar-border bg-sidebar px-4 flex items-center shrink-0 shadow-lg z-20 relative">
      {/* Brand mark */}
      <Link href="/" className="flex items-center gap-3 shrink-0 group">
        <img
          src={`${basePath}/vv-logo.png`}
          alt="VectorVest"
          className="h-7 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <span className="text-[10px] font-semibold tracking-widest text-primary/70 uppercase mt-0.5 hidden lg:block">
          Community Europe
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
          <span className="text-xs font-medium text-sidebar-foreground/60 hidden md:block">
            {user.username || user.firstName}
          </span>
          <img
            src={user.imageUrl}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-primary/30 shadow"
          />
        </div>
      )}
    </nav>
  );
}
