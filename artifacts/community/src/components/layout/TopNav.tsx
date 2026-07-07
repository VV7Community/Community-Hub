import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { MessageSquare, Video, BookOpen, Calendar, UserCircle } from "lucide-react";
import { useClerk } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function TopNav() {
  const [location] = useLocation();
  const { user } = useClerk();

  const navItems = [
    { label: "Main Room",   path: "/room/main-chat", icon: MessageSquare, activeMatches: ["/room"] },
    { label: "Webinar",     path: "/webinar",         icon: Video,         activeMatches: ["/webinar"] },
    { label: "University",  path: "/university",      icon: BookOpen,      activeMatches: ["/university"] },
    { label: "Events",      path: "/events",          icon: Calendar,      activeMatches: ["/events"] },
    { label: "Account",     path: "/account",         icon: UserCircle,    activeMatches: ["/account"] },
  ];

  return (
    <nav className="h-14 border-b border-sidebar-border bg-sidebar px-4 flex items-center shrink-0 shadow-lg z-20 relative">
      {/* Brand mark */}
      <Link href="/" className="flex items-center gap-3 mr-8 shrink-0 group">
        <img
          src={`${basePath}/vv-logo.png`}
          alt="VectorVest"
          className="h-7 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <span className="text-[11px] font-semibold tracking-widest text-primary/80 uppercase mt-0.5 hidden sm:block">
          Community Europe
        </span>
      </Link>

      {/* Divider */}
      <div className="w-px h-6 bg-sidebar-border mr-6 hidden sm:block" />

      {/* Nav tabs */}
      <div className="flex gap-0.5 h-full flex-1">
        {navItems.map((item) => {
          const isActive = item.activeMatches.some(m => location.startsWith(m));
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative flex items-center gap-2 px-4 h-full text-sm font-medium transition-all hover:text-foreground rounded-t-md",
                isActive
                  ? "text-primary after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground/80 hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User */}
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
