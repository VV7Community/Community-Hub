import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListChannels, getListChannelsQueryKey,
  useGetChannelMessages, getGetChannelMessagesQueryKey,
  useGetPinnedMessage, getGetPinnedMessageQueryKey,
  useGetOnlineUsers, getGetOnlineUsersQueryKey,
  useSendMessage,
  useAddReaction,
  useRemoveReaction,
  useGetMe,
  Message,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { Hash, Lock, Pin, PinOff, Send, SmilePlus, ChevronDown, Menu, X, Users } from "lucide-react";
import { usePinMessage } from "@workspace/api-client-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// ─── Message item ─────────────────────────────────────────────────
function MessageItem({ message, channelId, isAdmin }: { message: Message; channelId: string; isAdmin: boolean }) {
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();
  const queryClient = useQueryClient();
  const pinMessage = usePinMessage({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPinnedMessageQueryKey(channelId) });
        queryClient.invalidateQueries({ queryKey: getGetChannelMessagesQueryKey(channelId, {}) });
      },
    },
  });

  const handleReaction = (emoji: string, hasReacted: boolean) => {
    if (hasReacted) {
      removeReaction.mutate({ messageId: message.id, emoji });
    } else {
      addReaction.mutate({ messageId: message.id, data: { emoji } });
    }
  };

  const showTeamBadge = channelId === "vv7-daily" && message.authorRole === "admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors"
    >
      <Avatar className="w-9 h-9 shrink-0 border border-border mt-0.5">
        <AvatarImage src={message.avatarUrl || undefined} />
        <AvatarFallback>{message.username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-semibold text-[15px]">{message.username}</span>
          {showTeamBadge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-primary/20 text-primary">
              VectorVest Team
            </span>
          )}
          <span className="text-xs text-muted-foreground">{format(new Date(message.createdAt), "dd/MM HH:mm")}</span>
        </div>
        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed mt-1 break-words">
          {message.content}
        </p>

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map(r => (
              <button
                key={r.emoji}
                onClick={() => handleReaction(r.emoji, r.userReacted)}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors touch-manipulation",
                  r.userReacted
                    ? "bg-primary/20 border-primary/30 text-primary"
                    : "bg-background border-border text-muted-foreground hover:border-muted-foreground"
                )}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick reaction — desktop hover only */}
      <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity items-center absolute right-2 -top-3 bg-background border border-border rounded-md shadow-sm z-10">
        {["👍","🔥","🚀"].map(e => (
          <button
            key={e}
            onClick={() => handleReaction(e, false)}
            className="p-1.5 hover:bg-muted first:rounded-l-md last:rounded-r-md text-muted-foreground hover:text-foreground"
          >
            {e}
          </button>
        ))}
        {isAdmin && (
          <button
            onClick={() => pinMessage.mutate({ messageId: message.id, data: { pinned: !message.isPinned } })}
            title={message.isPinned ? "Losmaken" : "Vastmaken"}
            className="p-1.5 hover:bg-muted last:rounded-r-md text-muted-foreground hover:text-foreground border-l border-border"
          >
            {message.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Channel list (shared by sidebar + drawer) ────────────────────
const CATEGORIES = [
  { id: "INFO",      label: "Info" },
  { id: "COMMUNITY", label: "Community" },
];

function ChannelList({ channels, channelId, onSelect, me }: {
  channels: Array<{ id: string; name: string; category: string; writable: boolean; unreadCount?: number | null }> | undefined;
  channelId: string;
  onSelect?: () => void;
  me?: { avatarUrl?: string | null; username: string; role: string } | null;
}) {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-6">
          {CATEGORIES.map(cat => {
            const cats = channels?.filter(c => c.category === cat.id) || [];
            if (cats.length === 0) return null;
            return (
              <div key={cat.id}>
                <h3 className="px-2 text-xs font-bold text-sidebar-foreground/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ChevronDown className="w-3 h-3" />
                  {cat.label}
                </h3>
                <div className="space-y-0.5">
                  {cats.map(c => {
                    const isActive = c.id === channelId;
                    const showLock = cat.id === "INFO" || !c.writable;
                    return (
                      <Link
                        key={c.id}
                        href={`/room/${c.id}`}
                        onClick={onSelect}
                        className={cn(
                          "flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-[40px]",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        {showLock ? (
                          <Lock className="w-4 h-4 shrink-0 opacity-50" />
                        ) : (
                          <Hash className="w-4 h-4 shrink-0 opacity-70" />
                        )}
                        <span className="truncate">{c.name}</span>
                        {c.unreadCount ? (
                          <span className="ml-auto w-2 h-2 rounded-full bg-destructive shrink-0" aria-label="Unread messages" />
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {me && (
        <div className="p-3 border-t border-sidebar-border bg-sidebar/80 flex items-center gap-3 shrink-0">
          <div className="relative">
            <Avatar className="w-8 h-8 border border-border">
              <AvatarImage src={me.avatarUrl || undefined} />
              <AvatarFallback>{me.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-sidebar" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">{me.username}</span>
            <span className="text-xs text-muted-foreground capitalize">{me.role}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Room ────────────────────────────────────────────────────
export default function MainRoom() {
  const params = useParams();
  const channelId = params.channelId || "chat";
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: channels } = useListChannels({ query: { queryKey: getListChannelsQueryKey() } });
  const { data: messages } = useGetChannelMessages(channelId, {}, {
    query: { enabled: !!channelId, queryKey: getGetChannelMessagesQueryKey(channelId, {}) },
  });
  const { data: pinnedMsg } = useGetPinnedMessage(channelId, {
    query: { enabled: !!channelId, queryKey: getGetPinnedMessageQueryKey(channelId) },
  });
  const { data: onlineData } = useGetOnlineUsers({
    query: { queryKey: getGetOnlineUsersQueryKey(), refetchInterval: 30000 },
  });
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });

  useWebSocket(channelId, me ? { userId: me.userId, username: me.username, avatarUrl: me.avatarUrl } : undefined);

  const sendMessage = useSendMessage();
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentChannel = channels?.find(c => c.id === channelId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Close drawer when channel changes
  useEffect(() => { setDrawerOpen(false); }, [channelId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentChannel?.writable) return;
    sendMessage.mutate({ channelId, data: { content: inputValue } }, {
      onSuccess: () => setInputValue(""),
    });
  };

  return (
    <div className="flex h-full w-full overflow-hidden">

      {/* ── Left Sidebar — hidden on mobile ────────────────────── */}
      <div className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex-col shrink-0">
        <ChannelList channels={channels} channelId={channelId} me={me} />
      </div>

      {/* ── Mobile channel drawer ──────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="md:hidden fixed top-14 bottom-14 left-0 w-72 max-w-[85vw] bg-sidebar border-r border-sidebar-border z-50 flex flex-col shadow-2xl"
            >
              <div className="h-12 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
                <span className="font-bold text-sm">Channels</span>
                <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-md hover:bg-sidebar-accent">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChannelList channels={channels} channelId={channelId} onSelect={() => setDrawerOpen(false)} me={me} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Chat Area ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">

        {/* Chat header */}
        <div className="h-14 border-b border-border flex items-center px-3 sm:px-4 shrink-0 shadow-sm z-10 gap-2">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors touch-manipulation shrink-0"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open channels"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            {!currentChannel?.writable
              ? <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
              : <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
            }
            <h2 className="font-bold text-base sm:text-lg truncate">{currentChannel?.name || "…"}</h2>
          </div>

          {currentChannel?.description && (
            <p className="hidden sm:block text-sm text-muted-foreground truncate ml-2 border-l border-border pl-3">
              {currentChannel.description}
            </p>
          )}

          {/* Online count pill — mobile */}
          <div className="ml-auto md:hidden flex items-center gap-1 text-xs text-muted-foreground bg-sidebar px-2 py-1 rounded-full shrink-0">
            <Users className="w-3 h-3" />
            <span>{onlineData?.count ?? 0}</span>
          </div>
        </div>

        {/* Pinned message */}
        {pinnedMsg && (
          <div className="bg-muted/30 border-b border-border p-2.5 sm:p-3 flex items-start gap-2 sm:gap-3 shrink-0">
            <Pin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-medium text-xs text-primary">Pinned · {pinnedMsg.username}</span>
              <p className="text-sm text-muted-foreground truncate">{pinnedMsg.content}</p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {messages?.slice().reverse().map(msg => (
              <MessageItem key={msg.id} message={msg} channelId={channelId} isAdmin={me?.role === "admin"} />
            ))}
          </AnimatePresence>
          {messages?.length === 0 && (
            <div className="h-full flex items-center justify-center flex-col text-muted-foreground text-center px-4">
              <Hash className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">Welcome to #{currentChannel?.name}</p>
              <p className="text-sm">This is the start of the channel.</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-2 sm:p-4 pt-0 shrink-0">
          {currentChannel?.writable ? (
            <form
              onSubmit={handleSend}
              className="flex items-center bg-card border border-border rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all"
            >
              <button type="button" className="p-3 text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <SmilePlus className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={`Message #${currentChannel?.name || ""}`}
                className="flex-1 bg-transparent border-0 py-3 px-1 text-sm focus:outline-none focus:ring-0 placeholder:text-muted-foreground min-w-0"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || sendMessage.isPending}
                className="p-3 text-primary hover:text-primary/80 disabled:opacity-50 transition-colors shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="bg-muted border border-border rounded-lg p-3 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>
                {currentChannel?.category === "INFO"
                  ? "This is an official channel — only the VectorVest team can post here."
                  : "Only the VectorVest team posts here — react to join the conversation."}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Sidebar — hidden on mobile & tablet ──────────── */}
      <div className="hidden lg:flex w-56 bg-sidebar border-l border-sidebar-border flex-col shrink-0">
        <div className="h-14 border-b border-border flex items-center px-4 shrink-0">
          <h3 className="font-bold text-sm">Online — {onlineData?.count || 0}</h3>
        </div>
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-1">
            {onlineData?.users.map(u => (
              <div key={u.userId} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-sidebar-accent transition-colors cursor-default">
                <div className="relative shrink-0">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={u.avatarUrl || undefined} />
                    <AvatarFallback>{u.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-sidebar" />
                </div>
                <span className="text-sm font-medium text-sidebar-foreground/80 truncate">{u.username}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
