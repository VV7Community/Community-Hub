import React, { useState } from "react";
import { 
  Hash, 
  MessageSquare, 
  Video, 
  BookOpen, 
  Calendar, 
  LifeBuoy, 
  Search, 
  Bell, 
  Settings, 
  User, 
  Smile, 
  Plus, 
  MoreVertical, 
  Send, 
  Paperclip,
  ChevronDown,
  ShieldCheck,
  Zap
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ConversationFirst() {
  const [activeChannel, setActiveChannel] = useState("main-room");

  return (
    <div className="flex h-[100dvh] w-full bg-[#0b1120] text-slate-300 font-sans overflow-hidden">
      
      {/* Top App Header */}
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center px-4 border-b border-slate-800 bg-[#0a0f1d] z-10">
        <div className="flex items-center gap-3 w-[244px] shrink-0">
          <div className="size-8 rounded bg-gradient-to-br from-[#e1b95e] to-[#b38d38] flex items-center justify-center shadow-[0_0_15px_rgba(225,185,94,0.15)]">
            <Zap className="w-5 h-5 text-[#0a0f1d] fill-current" />
          </div>
          <span className="font-bold text-slate-100 text-[17px] tracking-tight">VectorVest</span>
        </div>

        <nav className="flex-1 flex items-center gap-1 px-4">
          <Button variant="ghost" className="text-[#e1b95e] bg-slate-800/50 hover:text-[#e1b95e] hover:bg-slate-800/80 h-9 font-medium">
            <MessageSquare className="w-4 h-4 mr-2" /> Chat
          </Button>
          <Button variant="ghost" className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 h-9">
            <Video className="w-4 h-4 mr-2" /> Webinars
          </Button>
          <Button variant="ghost" className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 h-9">
            <BookOpen className="w-4 h-4 mr-2" /> University
          </Button>
          <Button variant="ghost" className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 h-9">
            <Calendar className="w-4 h-4 mr-2" /> Events
          </Button>
          <Button variant="ghost" className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 h-9">
            <LifeBuoy className="w-4 h-4 mr-2" /> Support
          </Button>
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <div className="relative w-64 hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input 
              placeholder="Search community..." 
              className="h-9 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 pl-9 focus-visible:ring-[#e1b95e]/50 focus-visible:border-[#e1b95e]/50"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-200 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0f1d]"></span>
          </Button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-800 cursor-pointer group">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-slate-200 group-hover:text-slate-100 transition-colors">bjarne</div>
              <div className="text-xs text-[#e1b95e] flex items-center gap-1 justify-end">
                <ShieldCheck className="w-3 h-3" /> Admin
              </div>
            </div>
            <Avatar className="h-9 w-9 border border-[#e1b95e]/30 group-hover:border-[#e1b95e] transition-colors">
              <AvatarFallback className="bg-[#131c4a] text-[#e1b95e] font-semibold">BJ</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-14 w-full h-full">
        
        {/* Left Sidebar - Channels & DMs */}
        <div className="w-[260px] flex flex-col bg-[#0f172a] border-r border-slate-800 shrink-0">
          <div className="h-14 flex items-center px-4 justify-between border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors">
            <div>
              <h2 className="font-semibold text-slate-100">VV Europe Member</h2>
              <p className="text-[11px] text-[#e1b95e]">Premium Access</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-6">
              
              <div className="space-y-1">
                <div className="px-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center group">
                  <span>Trading Floors</span>
                  <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 hover:text-slate-300 cursor-pointer transition-opacity" />
                </div>
                <ChannelItem icon={<Hash className="w-4 h-4" />} label="main-room" active={activeChannel === "main-room"} onClick={() => setActiveChannel("main-room")} unread />
                <ChannelItem icon={<Hash className="w-4 h-4" />} label="market-open" active={activeChannel === "market-open"} onClick={() => setActiveChannel("market-open")} />
                <ChannelItem icon={<Hash className="w-4 h-4" />} label="options-trading" active={activeChannel === "options-trading"} onClick={() => setActiveChannel("options-trading")} />
                <ChannelItem icon={<Hash className="w-4 h-4" />} label="belgium-nl" active={activeChannel === "belgium-nl"} onClick={() => setActiveChannel("belgium-nl")} />
              </div>

              <div className="space-y-1">
                <div className="px-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center group">
                  <span>Resources</span>
                </div>
                <ChannelItem icon={<Video className="w-4 h-4" />} label="live-webinars" active={activeChannel === "live-webinars"} onClick={() => setActiveChannel("live-webinars")} />
                <ChannelItem icon={<BookOpen className="w-4 h-4" />} label="course-discussion" active={activeChannel === "course-discussion"} onClick={() => setActiveChannel("course-discussion")} />
                <ChannelItem icon={<Calendar className="w-4 h-4" />} label="upcoming-events" active={activeChannel === "upcoming-events"} onClick={() => setActiveChannel("upcoming-events")} />
              </div>

              <div className="space-y-1">
                <div className="px-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center group">
                  <span>Direct Messages</span>
                  <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 hover:text-slate-300 cursor-pointer transition-opacity" />
                </div>
                <UserItem name="Support Team" status="online" badge="Staff" />
                <UserItem name="Jeroen V." status="offline" />
                <UserItem name="Marc Trading" status="online" />
                <UserItem name="Sarah V." status="online" />
              </div>

            </div>
          </ScrollArea>
        </div>

        {/* Center - Active Chat */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0b1120] relative">
          
          {/* Chat Header */}
          <div className="h-14 flex items-center px-4 justify-between border-b border-slate-800 bg-[#0b1120]/95 backdrop-blur shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-slate-400" />
              <h3 className="font-semibold text-slate-100">{activeChannel}</h3>
              <Separator orientation="vertical" className="h-5 bg-slate-700 ml-1 mr-1" />
              <span className="text-slate-400 text-sm hidden md:inline-block">
                General discussion for VectorVest Europe members
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2 mr-2 hidden sm:flex">
                 <Avatar className="h-7 w-7 border-2 border-[#0b1120]"><AvatarFallback className="bg-blue-600 text-[10px] text-white">JV</AvatarFallback></Avatar>
                 <Avatar className="h-7 w-7 border-2 border-[#0b1120]"><AvatarFallback className="bg-emerald-600 text-[10px] text-white">MT</AvatarFallback></Avatar>
                 <Avatar className="h-7 w-7 border-2 border-[#0b1120]"><AvatarFallback className="bg-purple-600 text-[10px] text-white">SV</AvatarFallback></Avatar>
                 <div className="h-7 w-7 rounded-full bg-slate-800 border-2 border-[#0b1120] flex items-center justify-center text-[10px] text-slate-300 font-medium">+42</div>
              </div>
              <Separator orientation="vertical" className="h-5 bg-slate-700 hidden sm:block" />
              <div className="flex">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-200">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-200">
                  <User className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-4 py-6">
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Date Separator */}
              <div className="flex items-center gap-4 my-6">
                <Separator className="flex-1 bg-slate-800" />
                <span className="text-xs font-semibold text-slate-500">Today, October 24</span>
                <Separator className="flex-1 bg-slate-800" />
              </div>

              <Message 
                author="System" 
                time="08:00" 
                content="Welcome to the Main Room! Keep discussions focused on today's market conditions."
                isSystem
              />
              
              <Message 
                author="Marc Trading" 
                time="09:15" 
                content="Good morning everyone! Just checked the Color Guard, looking a bit bearish today. Might hold off on new entries."
                avatar="MT"
                color="bg-emerald-600"
              />
              
              <Message 
                author="Jeroen V." 
                time="09:18" 
                content="Agreed Marc. The MTI is dipping below 1.0. I'm keeping an eye on my stops."
                avatar="JV"
                color="bg-blue-600"
              />
              
              <Message 
                author="bjarne" 
                time="09:25" 
                content={
                  <div className="space-y-3">
                    <p>Just a reminder, we have a live Q&A webinar covering the current market timing signals at 11:00 CET. We'll look specifically at the C/Up situation and European indices.</p>
                    <div className="p-3 rounded-lg bg-[#131c4a]/50 border border-[#e1b95e]/20 flex items-start gap-4 max-w-md hover:bg-[#131c4a] transition-colors cursor-pointer group">
                       <div className="bg-[#e1b95e]/10 p-2.5 rounded-md text-[#e1b95e] group-hover:scale-105 transition-transform">
                         <Video className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="font-semibold text-sm text-slate-100">Market Timing Q&A</h4>
                         <p className="text-xs text-[#e1b95e] mt-1 font-medium">Starts in 1h 35m • Members only</p>
                         <Button size="sm" className="mt-3 h-8 bg-[#e1b95e] text-[#0a0f1d] hover:bg-[#d4a853] text-xs font-bold w-full sm:w-auto">
                           Join Waiting Room
                         </Button>
                       </div>
                    </div>
                  </div>
                }
                avatar="BJ"
                color="bg-[#131c4a]"
                isAdmin
              />
              
              <Message 
                author="Sarah V." 
                time="09:30" 
                content="Thanks Bjarne! I'll be there. I have a few questions about the recent trends on the AEX."
                avatar="SV"
                color="bg-purple-600"
              />
              
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 pt-0 bg-[#0b1120] shrink-0 mt-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#0f172a] border border-slate-700 rounded-lg shadow-sm focus-within:border-[#e1b95e]/50 focus-within:ring-1 focus-within:ring-[#e1b95e]/50 transition-all group overflow-hidden">
                <div className="px-4 py-3 min-h-[60px]">
                  <input 
                    type="text" 
                    placeholder={`Message #${activeChannel}...`} 
                    className="w-full bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 text-sm"
                  />
                </div>
                <div className="flex items-center justify-between px-2 py-2 bg-[#0a0f1d] border-t border-slate-800/50">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-4 bg-slate-700 mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button size="sm" className="h-8 bg-[#e1b95e] text-[#0a0f1d] hover:bg-[#d4a853] font-semibold px-4 transition-all active:scale-95">
                    <Send className="w-3.5 h-3.5 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
              <div className="text-[10px] text-center mt-2 text-slate-500">
                <strong>Return</strong> to send <span className="mx-1">•</span> <strong>Shift + Return</strong> to add a new line
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// Subcomponents

function ChannelItem({ icon, label, active, onClick, unread }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, unread?: boolean }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between group cursor-pointer px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-all ${
        active 
          ? "bg-slate-800/80 text-slate-100" 
          : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={active ? "text-slate-300" : "text-slate-500"}>{icon}</span>
        <span>{label}</span>
      </div>
      {unread && !active && (
        <div className="w-1.5 h-1.5 rounded-full bg-[#e1b95e]"></div>
      )}
    </div>
  )
}

function UserItem({ name, status, badge }: { name: string, status: string, badge?: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer px-2.5 py-1.5 rounded-md hover:bg-slate-800/40 transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <Avatar className="h-6 w-6 border border-slate-700">
            <AvatarFallback className="bg-slate-800 text-[9px] text-slate-300 font-semibold">
              {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-[1.5px] border-[#0f172a] ${
            status === 'online' ? 'bg-emerald-500' : 'bg-slate-500'
          }`}></div>
        </div>
        <span className={`text-[13px] ${status === 'online' ? 'text-slate-300' : 'text-slate-500'} group-hover:text-slate-100 font-medium transition-colors`}>{name}</span>
      </div>
      {badge && (
        <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-[#131c4a] text-[#e1b95e] border border-[#e1b95e]/20 rounded-sm">
          {badge}
        </Badge>
      )}
    </div>
  )
}

function Message({ author, time, content, avatar, color, isSystem, isAdmin }: any) {
  if (isSystem) {
    return (
      <div className="flex items-center gap-3 px-2 py-1">
        <div className="w-10 flex justify-center shrink-0">
          <LifeBuoy className="w-4 h-4 text-slate-500" />
        </div>
        <p className="text-sm text-slate-400 italic">{content}</p>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-4 group px-2 py-2 -mx-2 hover:bg-slate-800/30 rounded-lg transition-colors relative">
      <Avatar className="h-10 w-10 shrink-0 mt-0.5 border border-slate-800 shadow-sm">
        <AvatarFallback className={`${color} text-white font-semibold text-sm`}>{avatar}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-[15px] ${isAdmin ? "text-[#e1b95e]" : "text-slate-200"}`}>{author}</span>
          {isAdmin && (
            <Badge variant="secondary" className="h-4 px-1.5 text-[9px] bg-[#131c4a] text-[#e1b95e] border border-[#e1b95e]/20 rounded uppercase tracking-wider flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> Admin
            </Badge>
          )}
          <span className="text-xs text-slate-500 font-medium ml-1">{time}</span>
        </div>
        <div className="text-slate-300 text-[15px] leading-relaxed">
          {content}
        </div>
      </div>
      
      {/* Quick Actions Hover */}
      <div className="absolute right-4 top-2 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 bg-[#0a0f1d] border border-slate-700 rounded-md p-0.5 shadow-md transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-[#e1b95e] hover:bg-slate-800">
          <Smile className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200 hover:bg-slate-800">
          <MessageSquare className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200 hover:bg-slate-800">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
