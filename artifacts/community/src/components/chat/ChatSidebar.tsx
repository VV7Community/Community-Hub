import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Hash, Lock, FileText, File, Headphones, ChevronDown } from "lucide-react";
import type { Message } from "@workspace/api-client-react";

type ChannelCategory = "INFO" | "COMMUNITY";

type Channel = {
  id: string;
  name: string;
  description?: string;
  category: ChannelCategory;
  writable: boolean;
  unreadCount?: number | null;
};

interface ChatSidebarProps {
  channels: Channel[] | undefined;
  activeChannelId: string;
  me?: { userId: string; username: string; avatarUrl?: string | null; role: string } | null;
  onItemClick?: () => void;
}

const CATEGORIES: { id: ChannelCategory; label: string }[] = [
  { id: "INFO", label: "Info" },
  { id: "COMMUNITY", label: "Community" },
];

const RESOURCES = [
  { id: "slides", label: "Slides", icon: FileText, href: "/resources/slides" },
  { id: "files", label: "Files", icon: File, href: "/resources/files" },
];

export function ChatSidebar({ channels, activeChannelId, me, onItemClick }: ChatSidebarProps) {
  const [location] = useLocation();
  const isSupportActive = activeChannelId === "support";

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <ScrollArea className="flex-1 pt-2">
        <div className="p-3 space-y-5">
          {/* INFO & COMMUNITY channels */}
          {CATEGORIES.map((cat) => {
            const cats = channels?.filter((c) => c.category === cat.id) || [];
            if (cats.length === 0) return null;
            return (
              <section key={cat.id}>
                <h3 className="mb-2 flex items-center gap-1 px-2 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
                  <ChevronDown className="h-3 w-3" />
                  {cat.label}
                </h3>
                <div className="space-y-0.5">
                  {cats.map((c) => {
                    const isActive = c.id === activeChannelId;
                    const showLock = cat.id === "INFO" || !c.writable;
                    return (
                      <Link
                        key={c.id}
                        href={`/room/${c.id}`}
                        onClick={onItemClick}
                        className={cn(
                          "flex min-h-[40px] items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors touch-manipulation",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        )}
                      >
                        {showLock ? (
                          <Lock className="h-4 w-4 shrink-0 opacity-50" />
                        ) : (
                          <Hash className="h-4 w-4 shrink-0 opacity-70" />
                        )}
                        <span className="truncate">{c.name}</span>
                        {c.unreadCount ? (
                          <span
                            className="ml-auto h-2 w-2 shrink-0 rounded-full bg-destructive"
                            aria-label="Unread messages"
                          />
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Resources */}
          <section>
            <h3 className="mb-2 flex items-center gap-1 px-2 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
              <ChevronDown className="h-3 w-3" />
              Resources
            </h3>
            <div className="space-y-0.5">
              {RESOURCES.map((r) => (
                <Link
                  key={r.id}
                  href={r.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex min-h-[40px] items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors touch-manipulation",
                    location.startsWith(r.href)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  <r.icon className="h-4 w-4 shrink-0 opacity-70" />
                  <span className="truncate">{r.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Direct Messages */}
          <section>
            <h3 className="mb-2 flex items-center gap-1 px-2 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
              <ChevronDown className="h-3 w-3" />
              Direct Messages
            </h3>
            <div className="space-y-0.5">
              <Link
                href="/room/support"
                onClick={onItemClick}
                className={cn(
                  "flex min-h-[40px] items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors touch-manipulation",
                  isSupportActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <div className="relative">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    <Headphones className="h-3 w-3" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 rounded-full border border-sidebar bg-primary px-1 text-[8px] font-bold text-primary-foreground">
                    staff
                  </span>
                </div>
                <span className="truncate">Support Team</span>
              </Link>
            </div>
          </section>
        </div>
      </ScrollArea>

      {/* User footer */}
      {me && (
        <div className="flex items-center gap-3 border-t border-sidebar-border bg-sidebar/80 p-3">
          <div className="relative">
            <Avatar className="h-8 w-8 border border-border">
              {me.avatarUrl && <AvatarImage src={me.avatarUrl} />}
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {me.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-primary" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">{me.username}</span>
            <span className="text-xs capitalize text-muted-foreground">{me.role}</span>
          </div>
        </div>
      )}
    </div>
  );
}
