import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
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
  getGetMeQueryKey
} from "@workspace/api-client-react";
import { Hash, Lock, Volume2, Pin, Send, SmilePlus, ChevronDown } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

function MessageItem({ message, currentUserId }: { message: Message, currentUserId?: string }) {
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();
  
  const handleReaction = (emoji: string, hasReacted: boolean) => {
    if (hasReacted) {
      removeReaction.mutate({ messageId: message.id, emoji });
    } else {
      addReaction.mutate({ messageId: message.id, data: { emoji } });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex gap-4 hover:bg-muted/50 p-2 rounded-md transition-colors"
    >
      <Avatar className="w-10 h-10 border border-border mt-0.5">
        <AvatarImage src={message.avatarUrl || undefined} />
        <AvatarFallback>{message.username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-[15px]">{message.username}</span>
          <span className="text-xs text-muted-foreground">{format(new Date(message.createdAt), "MMM d, h:mm a")}</span>
        </div>
        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed mt-1">
          {message.content}
        </p>
        
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map(r => (
              <button
                key={r.emoji}
                onClick={() => handleReaction(r.emoji, r.userReacted)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors",
                  r.userReacted 
                    ? "bg-primary/20 border-primary/30 text-primary-foreground" 
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
      
      {/* Quick reaction bar on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center absolute right-4 -top-3 bg-background border border-border rounded-md shadow-sm">
        <button onClick={() => handleReaction("👍", false)} className="p-1.5 hover:bg-muted rounded-l-md text-muted-foreground hover:text-foreground">👍</button>
        <button onClick={() => handleReaction("🔥", false)} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground">🔥</button>
        <button onClick={() => handleReaction("🚀", false)} className="p-1.5 hover:bg-muted rounded-r-md text-muted-foreground hover:text-foreground">🚀</button>
      </div>
    </motion.div>
  );
}

export default function MainRoom() {
  const params = useParams();
  const channelId = params.channelId || "main-chat";
  
  const { data: channels } = useListChannels({ query: { queryKey: getListChannelsQueryKey() } });
  const { data: messages } = useGetChannelMessages(channelId, {}, {
    query: { enabled: !!channelId, queryKey: getGetChannelMessagesQueryKey(channelId, {}) }
  });
  const { data: pinnedMsg } = useGetPinnedMessage(channelId, {
    query: { enabled: !!channelId, queryKey: getGetPinnedMessageQueryKey(channelId) }
  });
  const { data: onlineData } = useGetOnlineUsers({
    query: { queryKey: getGetOnlineUsersQueryKey(), refetchInterval: 30000 }
  });
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() }});

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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentChannel?.writable) return;
    
    sendMessage.mutate({ channelId, data: { content: inputValue } }, {
      onSuccess: () => setInputValue("")
    });
  };

  const channelCategories = [
    { id: "WELCOME", label: "Welcome" },
    { id: "COMMUNITY", label: "Community" },
    { id: "RESOURCES", label: "Resources" }
  ];

  return (
    <div className="flex h-full w-full">
      {/* Left Sidebar - Channels */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-6">
            {channelCategories.map(cat => {
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
                      return (
                        <Link 
                          key={c.id} 
                          href={`/room/${c.id}`}
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors group",
                            isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          )}
                        >
                          {!c.writable ? (
                            <Lock className="w-4 h-4 opacity-50" />
                          ) : c.category === "WELCOME" ? (
                            <Volume2 className="w-4 h-4 opacity-70" />
                          ) : (
                            <Hash className="w-4 h-4 opacity-70" />
                          )}
                          <span className="truncate">{c.name}</span>
                          {c.unreadCount ? (
                            <span className="ml-auto bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                              {c.unreadCount}
                            </span>
                          ) : null}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        {/* User profile snippet at bottom of sidebar */}
        {me && (
          <div className="p-3 border-t border-sidebar-border bg-sidebar/80 flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-9 h-9 border border-border">
                <AvatarImage src={me.avatarUrl || undefined} />
                <AvatarFallback>{me.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-sidebar"></div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate">{me.username}</span>
              <span className="text-xs text-muted-foreground truncate capitalize">{me.role}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center px-4 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-2">
            {!currentChannel?.writable ? <Lock className="w-5 h-5 text-muted-foreground" /> : <Hash className="w-5 h-5 text-muted-foreground" />}
            <h2 className="font-bold text-lg">{currentChannel?.name || "..."}</h2>
          </div>
          {currentChannel?.description && (
            <>
              <div className="w-px h-6 bg-border mx-4" />
              <p className="text-sm text-muted-foreground truncate">{currentChannel.description}</p>
            </>
          )}
        </div>

        {/* Pinned Message */}
        {pinnedMsg && (
          <div className="bg-muted/30 border-b border-border p-3 flex items-start gap-3 shrink-0">
            <Pin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-primary">Pinned by {pinnedMsg.username}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{pinnedMsg.content}</p>
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {messages?.slice().reverse().map(msg => (
              <MessageItem key={msg.id} message={msg} currentUserId={me?.userId} />
            ))}
          </AnimatePresence>
          {messages?.length === 0 && (
            <div className="h-full flex items-center justify-center flex-col text-muted-foreground">
              <Hash className="w-12 h-12 mb-4 opacity-20" />
              <p>Welcome to #{currentChannel?.name}</p>
              <p className="text-sm">This is the start of the channel.</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 pt-0 shrink-0">
          {currentChannel?.writable ? (
            <form onSubmit={handleSend} className="relative flex items-end bg-card border border-border rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
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
                className="p-3 text-primary hover:text-primary/80 disabled:opacity-50 disabled:hover:text-primary transition-colors shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="bg-muted border border-border rounded-lg p-3 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              You do not have permission to send messages in this channel.
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Online Users */}
      <div className="w-60 bg-sidebar border-l border-sidebar-border flex flex-col shrink-0">
        <div className="h-14 border-b border-border flex items-center px-4 shrink-0">
          <h3 className="font-bold text-sm">Online — {onlineData?.count || 0}</h3>
        </div>
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-1">
            {onlineData?.users.map(u => (
              <div key={u.userId} className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-sidebar-accent transition-colors group cursor-default">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={u.avatarUrl || undefined} />
                    <AvatarFallback>{u.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-sidebar"></div>
                </div>
                <span className="text-sm font-medium text-sidebar-foreground/80 group-hover:text-sidebar-foreground truncate">{u.username}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
