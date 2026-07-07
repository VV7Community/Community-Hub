import React, { useState } from "react";
import { 
  MessageSquare, 
  Video, 
  BookOpen, 
  Calendar, 
  LifeBuoy, 
  User, 
  Settings, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Bell,
  Search,
  TrendingUp,
  BarChart2,
  Clock,
  PlayCircle,
  FileText,
  Box
} from "lucide-react";

export default function CommandCenter() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("main");
  const [activeChannel, setActiveChannel] = useState("market-open");

  const NAV_ITEMS = [
    { id: "main", label: "Main Room", icon: MessageSquare },
    { id: "webinar", label: "Webinars", icon: Video },
    { id: "university", label: "University", icon: BookOpen },
    { id: "events", label: "Events", icon: Calendar },
    { id: "support", label: "Support", icon: LifeBuoy },
  ];

  const CHANNELS = [
    { id: "announcements", label: "Announcements", unread: 2 },
    { id: "market-open", label: "Market Open", unread: 0 },
    { id: "general-chat", label: "General Chat", unread: 15 },
    { id: "options-trading", label: "Options Trading", unread: 0 },
    { id: "support", label: "Platform Support", unread: 0 },
  ];

  const MESSAGES = [
    { id: 1, user: "bjarne (Admin)", time: "09:30 AM", text: "Market is open! Watch out for the volatility in tech stocks today.", avatar: "B", isSystem: false },
    { id: 2, user: "System", time: "09:35 AM", text: "New Course Available: Advanced Options Strategies. Check the University tab.", avatar: "S", isSystem: true },
    { id: 3, user: "TraderDan", time: "09:42 AM", text: "Anyone looking at $ASML today? Setting up nicely on the daily chart.", avatar: "D", isSystem: false },
    { id: 4, user: "SarahV", time: "09:45 AM", text: "Yes, holding support perfectly. Waiting for confirmation.", avatar: "SV", isSystem: false },
    { id: 5, user: "bjarne (Admin)", time: "09:50 AM", text: "Just a reminder: Live Q&A webinar starts in 10 minutes.", avatar: "B", isSystem: false },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0a101f] text-slate-300 font-sans overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <nav 
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } border-r border-slate-800 bg-[#0f172a] transition-all duration-300 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 text-[#d4a853] font-bold text-lg tracking-tight">
              <BarChart2 className="w-5 h-5" />
              <span>VectorVest</span>
            </div>
          )}
          {sidebarCollapsed && (
             <BarChart2 className="w-6 h-6 text-[#d4a853] mx-auto" />
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 absolute right-[-12px] top-5 bg-[#0f172a] border border-slate-800"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 py-4 flex flex-col gap-2 overflow-y-auto px-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full ${
                  isActive 
                    ? "bg-slate-800 text-[#d4a853]" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* User / Admin Section */}
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-slate-800 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-[#d4a853]/20 text-[#d4a853] flex items-center justify-center font-bold shrink-0 border border-[#d4a853]/30">
              B
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col items-start text-left flex-1 overflow-hidden">
                <span className="text-sm font-semibold text-white">bjarne</span>
                <span className="text-xs text-[#d4a853] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
              </div>
            )}
            {!sidebarCollapsed && <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />}
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a101f]">
        {/* HEADER */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]/50">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              {NAV_ITEMS.find(i => i.id === activeTab)?.label}
            </h1>
            {activeTab === "main" && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                System Operational
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search symbols, messages..." 
                className="bg-slate-900 border border-slate-700 text-sm rounded-md pl-9 pr-4 py-1.5 focus:outline-none focus:border-[#d4a853] w-64 text-white placeholder:text-slate-600 transition-colors"
              />
            </div>
            <button className="text-slate-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0a101f]">
                3
              </span>
            </button>
          </div>
        </header>

        {/* DASHBOARD LAYOUT */}
        <div className="flex-1 overflow-hidden flex">
          {activeTab === "main" ? (
            <>
              {/* CHANNELS PANEL */}
              <div className="w-64 border-r border-slate-800 flex flex-col bg-[#0f172a]/30 hidden lg:flex">
                <div className="p-4 border-b border-slate-800/50">
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Live Channels</h2>
                  <div className="space-y-1">
                    {CHANNELS.map(channel => (
                      <button
                        key={channel.id}
                        onClick={() => setActiveChannel(channel.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all ${
                          activeChannel === channel.id
                            ? "bg-[#d4a853]/10 text-[#d4a853] font-medium border border-[#d4a853]/20"
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                        }`}
                      >
                        <span className="truncate flex items-center gap-2">
                          <span className="text-lg opacity-50">#</span>
                          {channel.label}
                        </span>
                        {channel.unread > 0 && (
                          <span className="bg-[#d4a853] text-[#0f172a] text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                            {channel.unread}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 flex-1">
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Market Pulse</h2>
                  <div className="space-y-3">
                    {/* Mock Market Data Widgets */}
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-white">AEX</span>
                        <span className="text-xs text-emerald-400 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +1.2%</span>
                      </div>
                      <div className="h-8 w-full bg-slate-900 rounded overflow-hidden flex items-end">
                        {/* Fake mini chart */}
                        {[30, 45, 40, 60, 55, 75, 70, 85, 80, 95].map((h, i) => (
                          <div key={i} className="flex-1 bg-emerald-500/50 mx-[1px]" style={{height: `${h}%`}}></div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-white">BEL 20</span>
                        <span className="text-xs text-emerald-400 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +0.8%</span>
                      </div>
                      <div className="h-8 w-full bg-slate-900 rounded overflow-hidden flex items-end">
                        {[40, 35, 50, 45, 60, 65, 55, 70, 85, 80].map((h, i) => (
                          <div key={i} className="flex-1 bg-emerald-500/50 mx-[1px]" style={{height: `${h}%`}}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CHAT FEED */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#0a101f]">
                <div className="px-6 py-3 border-b border-slate-800/50 flex justify-between items-center bg-[#0f172a]/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-light text-slate-500">#</span>
                    <h2 className="font-medium text-white">{CHANNELS.find(c => c.id === activeChannel)?.label}</h2>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><User className="w-3 h-3"/> 142 online</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {MESSAGES.map((msg) => (
                    <div key={msg.id} className="flex gap-4 group">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center font-bold shrink-0 ${
                        msg.isSystem ? "bg-slate-800 text-slate-400" :
                        msg.avatar === "B" ? "bg-[#d4a853]/20 text-[#d4a853] border border-[#d4a853]/30" : 
                        "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                      }`}>
                        {msg.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className={`font-semibold text-sm ${
                            msg.isSystem ? "text-slate-400" :
                            msg.avatar === "B" ? "text-[#d4a853]" : "text-white"
                          }`}>
                            {msg.user}
                          </span>
                          <span className="text-xs text-slate-500">{msg.time}</span>
                        </div>
                        <div className={`text-sm ${msg.isSystem ? "text-slate-400 italic" : "text-slate-300"} leading-relaxed`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-slate-800 bg-[#0f172a]/50">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder={`Message #${CHANNELS.find(c => c.id === activeChannel)?.label}...`}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-[#d4a853] text-white shadow-inner transition-colors"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#d4a853] text-[#0f172a] rounded-md hover:bg-[#e1b95e] transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR (Command Center Details) */}
              <div className="w-80 border-l border-slate-800 flex flex-col bg-[#0f172a]/30 hidden xl:flex overflow-y-auto">
                <div className="p-5">
                  <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#d4a853]" />
                    Admin Actions
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 px-3 rounded flex flex-col items-center gap-1 transition-colors border border-slate-700">
                      <User className="w-4 h-4" />
                      Verify Members
                    </button>
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 px-3 rounded flex flex-col items-center gap-1 transition-colors border border-slate-700">
                      <Bell className="w-4 h-4" />
                      Global Alert
                    </button>
                  </div>

                  <h2 className="text-sm font-semibold text-white mb-4">Command Center</h2>
                  
                  {/* Up Next Widget */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Up Next</span>
                      <button className="text-xs text-[#d4a853] hover:underline">View All</button>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 group hover:bg-slate-800 transition-colors cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#d4a853]"></div>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded bg-[#d4a853]/10 flex items-center justify-center shrink-0 text-[#d4a853]">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1 group-hover:text-[#d4a853] transition-colors">Market Analysis Live</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Today, 14:00 CET
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Learning Progress Widget */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">My University</span>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3">
                      <div className="flex gap-3 mb-3">
                        <div className="w-10 h-10 rounded bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white line-clamp-1">Options Masterclass</h4>
                          <p className="text-xs text-slate-400">Module 4: Spreads</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 mb-1">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>65% Complete</span>
                        <button className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                          Resume <PlayCircle className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Resources */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Recent Resources</span>
                    </div>
                    <div className="space-y-2">
                      <a href="#" className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-md transition-colors group">
                        <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                        <span className="text-sm text-slate-300 group-hover:text-white">Q3 Earnings Cheat Sheet</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-md transition-colors group">
                        <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                        <span className="text-sm text-slate-300 group-hover:text-white">Weekly Market Setup (PDF)</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                  {React.createElement(NAV_ITEMS.find(i => i.id === activeTab)?.icon || Box, { className: "w-8 h-8 text-slate-400" })}
                </div>
                <h2 className="text-xl font-medium text-white mb-2">{NAV_ITEMS.find(i => i.id === activeTab)?.label} Area</h2>
                <p className="text-sm text-slate-400">Content for {activeTab} will go here.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
