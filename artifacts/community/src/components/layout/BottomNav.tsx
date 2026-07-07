import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { MessageSquare, Video, BookOpen, Calendar, UserCircle, HeadphonesIcon } from "lucide-react";

const navItems = [
  { label: "Room",       path: "/room/chat", icon: MessageSquare,  match: "/room" },
  { label: "Webinar",    path: "/webinar",         icon: Video,          match: "/webinar" },
  { label: "University", path: "/university",      icon: BookOpen,       match: "/university" },
  { label: "Events",     path: "/events",          icon: Calendar,       match: "/events" },
  { label: "Support",    path: "/support",         icon: HeadphonesIcon, match: "/support" },
  { label: "Account",    path: "/account",         icon: UserCircle,     match: "/account" },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-stretch border-t border-sidebar-border bg-sidebar"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {navItems.map((item) => {
        const isActive = location.startsWith(item.match);
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors min-h-[56px]",
              isActive
                ? "text-primary"
                : "text-sidebar-foreground/50 active:text-sidebar-foreground/80"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0", isActive && "drop-shadow-[0_0_6px_hsl(38_52%_57%/0.6)]")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
