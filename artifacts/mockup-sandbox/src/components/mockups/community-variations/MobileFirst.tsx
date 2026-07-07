import React, { useState } from 'react';
import { MessageSquare, Video, GraduationCap, Calendar, HelpCircle, User, Menu, Send, Shield, Bell, Clock, ChevronRight, MapPin } from 'lucide-react';

export default function MobileFirst() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('market-open');

  const navItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'webinar', icon: Video, label: 'Webinars' },
    { id: 'university', icon: GraduationCap, label: 'Learn' },
    { id: 'events', icon: Calendar, label: 'Events' },
    { id: 'support', icon: HelpCircle, label: 'Support' },
    { id: 'account', icon: User, label: 'Account' },
  ];

  const channels = [
    { id: 'announcements', name: 'Announcements', unread: 2 },
    { id: 'market-open', name: 'Market Open', unread: 0 },
    { id: 'trading-ideas', name: 'Trading Ideas', unread: 5 },
    { id: 'q-and-a', name: 'Q&A', unread: 0 },
  ];

  return (
    <div className="flex justify-center bg-slate-950 min-h-screen font-sans">
      <div className="w-full max-w-md bg-[#0f172a] text-slate-200 h-[100dvh] flex flex-col relative overflow-hidden shadow-2xl shadow-black/50">
        
        {/* Top Header */}
        <header className="flex items-center justify-between p-4 bg-[#131c4a] border-b border-slate-800 shrink-0 shadow-sm z-10 relative">
          <div className="flex items-center gap-3">
            <button 
              className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white tracking-tight leading-none mb-1">
                {navItems.find(i => i.id === activeTab)?.label}
              </h1>
              {activeTab === 'chat' && (
                <span className="text-xs text-[#d4a853] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853] shadow-[0_0_8px_rgba(212,168,83,0.8)]"></span>
                  #{channels.find(c => c.id === activeChannel)?.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-800 text-slate-300 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 shadow-sm border border-[#131c4a]"></span>
            </button>
            <button 
              onClick={() => setActiveTab('account')}
              className={`w-8 h-8 rounded-full bg-slate-800 border-2 overflow-hidden flex items-center justify-center transition-colors ${activeTab === 'account' ? 'border-[#d4a853]' : 'border-transparent hover:border-slate-600'}`}
            >
              <span className="text-xs font-bold text-[#d4a853]">BJ</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0a0f1d] relative">
          {activeTab === 'chat' && <ChatView activeChannel={activeChannel} />}
          {activeTab === 'webinar' && <WebinarView />}
          {activeTab === 'university' && <UniversityView />}
          {activeTab === 'events' && <EventsView />}
          {activeTab === 'support' && <SupportView />}
          {activeTab === 'account' && <AccountView />}
        </main>

        {/* Bottom Tab Bar */}
        <nav className="shrink-0 bg-[#0f172a] border-t border-slate-800 pb-safe z-20 relative">
          <div className="flex items-center justify-between px-2 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center w-14 py-2 gap-1 rounded-xl transition-all duration-200 ${
                    isActive ? 'text-[#d4a853] bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className={`relative ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.id === 'chat' && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#d4a853] rounded-full border-2 border-[#0f172a]" />
                    )}
                  </div>
                  <span className="text-[9px] font-semibold tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Channel Sidebar Drawer (Mobile) */}
        {isSidebarOpen && (
          <div className="absolute inset-0 z-50 flex">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="relative w-4/5 max-w-[300px] h-full bg-[#131c4a] border-r border-slate-800 flex flex-col animate-in slide-in-from-left duration-200 shadow-2xl">
              <div className="p-5 border-b border-slate-800 bg-gradient-to-br from-[#0f172a] to-[#131c4a]">
                <div className="text-xl font-black text-white mb-1 tracking-tight">VectorVest</div>
                <div className="text-sm font-medium text-[#d4a853]">Europe Community</div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 bg-[#0a0f1d]">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-3 mt-2">Channels</div>
                <div className="space-y-1">
                  {channels.map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setActiveChannel(channel.id);
                        setIsSidebarOpen(false);
                        setActiveTab('chat');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                        activeChannel === channel.id 
                          ? 'bg-[#d4a853]/10 text-[#d4a853] border border-[#d4a853]/20' 
                          : 'text-slate-300 hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={`text-lg font-light ${activeChannel === channel.id ? 'text-[#d4a853]' : 'text-slate-500'}`}>#</span>
                        {channel.name}
                      </span>
                      {channel.unread > 0 && (
                        <span className="bg-[#d4a853] text-[#0f172a] text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                          {channel.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Sub-views ---

function ChatView({ activeChannel }: { activeChannel: string }) {
  return (
    <div className="flex flex-col h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#131c4a]/20 to-[#0a0f1d]">
      <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-4">
        <div className="text-center my-6 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <div className="relative bg-[#0a0f1d] px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Today, 9:30 AM</div>
        </div>
        
        <ChatMessage 
          user="Admin Bjarne" 
          isAdmin 
          time="9:32 AM" 
          message="Good morning everyone! Market is opening strong today. Keep an eye on the leading tech stocks we discussed in yesterday's webinar." 
        />
        <ChatMessage 
          user="JanvdB" 
          time="9:35 AM" 
          message="Thanks Bjarne. Are we expecting the new CPI data to impact the afternoon session?" 
        />
        <ChatMessage 
          user="Admin Bjarne" 
          isAdmin 
          time="9:38 AM" 
          message="Absolutely, expect some volatility around 2 PM. Adjust your stops accordingly. We'll be monitoring the SPY levels closely in the Main Room." 
        />
        <ChatMessage 
          user="Pieter_Trading" 
          time="9:45 AM" 
          message="Just locked in 5% profit on ASML based on the VectorVest timing signals. Great start to the day! 🚀" 
        />
      </div>
      
      <div className="p-3 bg-[#131c4a]/90 backdrop-blur-md border-t border-slate-800 shrink-0">
        <div className="flex items-end gap-2 bg-[#0f172a] border border-slate-700 rounded-2xl p-1 shadow-inner focus-within:border-[#d4a853]/50 focus-within:ring-1 focus-within:ring-[#d4a853]/20 transition-all">
          <button className="p-2.5 text-slate-400 hover:text-white shrink-0 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </button>
          <textarea 
            className="flex-1 bg-transparent border-none text-white text-sm py-3 px-1 resize-none focus:outline-none placeholder:text-slate-500 max-h-32"
            placeholder={`Message #${activeChannel}...`}
            rows={1}
          />
          <button className="p-2.5 m-1 bg-[#d4a853] text-[#0f172a] rounded-xl hover:bg-[#e1b95e] shrink-0 transition-colors shadow-md shadow-[#d4a853]/20">
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ user, isAdmin, time, message }: { user: string, isAdmin?: boolean, time: string, message: string }) {
  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="shrink-0 mt-0.5">
        <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs shadow-sm ${isAdmin ? 'bg-gradient-to-br from-[#e1b95e] to-[#d4a853] text-[#0f172a]' : 'bg-slate-800 border border-slate-700 text-slate-300'}`}>
          {user.substring(0, 2).toUpperCase()}
        </div>
      </div>
      <div className="flex-1 min-w-0 bg-[#131c4a]/40 rounded-2xl rounded-tl-sm p-3 border border-slate-800/50">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className={`text-sm font-bold ${isAdmin ? 'text-[#d4a853]' : 'text-slate-200'}`}>{user}</span>
          {isAdmin && <Shield size={12} className="text-[#d4a853] fill-[#d4a853]/20" />}
          <span className="text-[10px] font-medium text-slate-500 ml-auto">{time}</span>
        </div>
        <div className="text-slate-300 text-[13px] leading-relaxed whitespace-pre-wrap break-words">
          {message}
        </div>
      </div>
    </div>
  );
}

function WebinarView() {
  return (
    <div className="p-4 space-y-6">
      <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-800 group shadow-lg shadow-black/20">
        <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80" alt="Trading Screen" className="w-full h-full object-cover opacity-50 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#0f172a] via-transparent to-transparent">
          <button className="w-14 h-14 bg-[#d4a853] text-[#0f172a] rounded-full flex items-center justify-center pl-1 mb-3 shadow-[0_0_20px_rgba(212,168,83,0.4)] hover:scale-110 transition-transform duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
          <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            LIVE NOW
          </div>
        </div>
      </div>
      
      <div className="space-y-1.5 px-1">
        <h2 className="text-xl font-bold text-white tracking-tight">Weekly Market Analysis</h2>
        <p className="text-sm text-slate-400 leading-relaxed">Join our experts for a deep dive into this week's top performers and market trends. Ask questions live.</p>
      </div>
      
      <div className="pt-5 border-t border-slate-800/80">
        <div className="flex justify-between items-end mb-4 px-1">
          <h3 className="text-sm font-bold text-slate-200">Upcoming Sessions</h3>
          <button className="text-xs font-semibold text-[#d4a853]">See Calendar</button>
        </div>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-4 bg-[#131c4a] p-3.5 rounded-2xl border border-slate-800 shadow-sm">
              <div className="bg-slate-800/80 rounded-xl p-2.5 text-center min-w-[3.5rem] border border-slate-700/50 flex flex-col justify-center">
                <div className="text-[10px] font-bold text-slate-400 tracking-widest">OCT</div>
                <div className="text-xl font-black text-[#d4a853]">1{i + 3}</div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="font-bold text-slate-200 text-sm mb-1">Portfolio Management Q&A</div>
                <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Clock size={12} className="text-[#d4a853]" /> 14:00 CET
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UniversityView() {
  return (
    <div className="p-4 space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#131c4a] to-[#0f172a] border border-[#d4a853]/20 p-5 shadow-lg shadow-[#d4a853]/5">
        <GraduationCap className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-800/40 transform -rotate-12" />
        <div className="relative z-10">
          <Badge className="bg-[#d4a853]/20 text-[#d4a853] border-none mb-3 text-[10px] font-bold px-2 py-1">CONTINUE LEARNING</Badge>
          <h2 className="text-xl font-bold text-white leading-tight mb-1.5 tracking-tight">VectorVest Options</h2>
          <p className="text-sm font-medium text-slate-300 mb-5">Module 3: Advanced Strategies</p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-end text-[10px] font-bold text-slate-400 tracking-wider">
              <span>PROGRESS</span>
              <span className="text-[#d4a853]">45%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-[#d4a853] to-[#e1b95e] w-[45%] h-full rounded-full relative">
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4 px-1">
          <h3 className="text-sm font-bold text-slate-200">Popular Courses</h3>
          <button className="text-xs font-semibold text-[#d4a853]">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {['Swing Trading Mastery', 'Dividend Investing', 'Market Timing Basics', 'Technical Analysis'].map((course, i) => (
            <div key={i} className="bg-[#131c4a] border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-700 transition-colors">
              <div className="h-24 bg-slate-900 relative">
                 <img src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1590283603385-17ffb3a7f29f' : '1642543492481-44e81e3914a7'}?auto=format&fit=crop&w=300&q=80`} alt={course} className="w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:opacity-50 transition-opacity" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#131c4a] to-transparent"></div>
              </div>
              <div className="p-3.5 pt-2 flex-1 flex flex-col">
                <h4 className="text-sm font-bold text-slate-200 mb-1 leading-snug flex-1">{course}</h4>
                <div className="text-[10px] font-medium text-slate-400 mt-2 flex items-center justify-between">
                  <span>{i + 4} Lessons</span>
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                    <ChevronRight size={10} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventsView() {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-br from-[#131c4a] to-[#0f172a] rounded-2xl border border-[#d4a853]/30 p-5 shadow-lg shadow-[#d4a853]/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a853]/5 rounded-full blur-3xl"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <Badge className="bg-[#d4a853] text-[#0f172a] text-[10px] font-black px-2 py-1 shadow-sm">FEATURED</Badge>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-[#131c4a] bg-slate-700 shadow-sm" />
            ))}
            <div className="w-7 h-7 rounded-full border-2 border-[#131c4a] bg-slate-800 flex items-center justify-center text-[9px] font-black text-[#d4a853] shadow-sm">+42</div>
          </div>
        </div>
        <h2 className="text-2xl font-black text-white mb-3 tracking-tight leading-tight relative z-10">Annual Europe Investor Summit 2024</h2>
        <div className="space-y-2.5 mb-6 relative z-10">
          <div className="flex items-center gap-2.5 text-sm font-medium text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center border border-slate-700/50">
              <Calendar size={14} className="text-[#d4a853]" />
            </div>
            <span>November 15-16, 2024</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center border border-slate-700/50">
              <MapPin size={14} className="text-[#d4a853]" />
            </div>
            <span>Amsterdam & Virtual</span>
          </div>
        </div>
        <button className="w-full py-3.5 bg-[#d4a853] text-[#0f172a] font-bold rounded-xl text-sm hover:bg-[#e1b95e] transition-colors shadow-md shadow-[#d4a853]/20 relative z-10">
          Register Now
        </button>
      </div>

      <div className="px-1">
        <h3 className="text-sm font-bold text-slate-200 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {['Local Chapter Meeting: Brussels', 'Online Workshop: Risk', 'Q3 Market Review'].map((event, i) => (
            <div key={i} className="flex gap-4 bg-[#131c4a] border border-slate-800 p-3.5 rounded-2xl items-center hover:bg-slate-800/50 transition-colors">
              <div className="bg-slate-900 border border-slate-800 rounded-xl w-14 h-14 flex flex-col items-center justify-center shrink-0 shadow-inner">
                <span className="text-[9px] font-bold text-slate-500 tracking-widest leading-none mb-1">OCT</span>
                <span className="text-lg font-black text-slate-200 leading-none">2{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-200 truncate mb-1">{event}</h4>
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-slate-800 text-slate-400 text-[9px] font-semibold px-1.5 py-0.5 rounded-md border border-slate-700">{i === 0 ? 'IN-PERSON' : 'VIRTUAL'}</Badge>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SupportView() {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center py-6 px-4 bg-gradient-to-br from-[#131c4a] to-[#0f172a] rounded-2xl border border-slate-800 shadow-sm">
        <div className="w-16 h-16 mx-auto bg-[#d4a853]/10 rounded-full flex items-center justify-center mb-4 border border-[#d4a853]/20">
          <HelpCircle size={32} className="text-[#d4a853]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">How can we help?</h2>
        <p className="text-sm text-slate-400 mb-6">Our support team is available Monday to Friday, 9AM to 5PM CET.</p>
        <button className="w-full py-3 bg-[#d4a853] text-[#0f172a] font-bold rounded-xl text-sm hover:bg-[#e1b95e] transition-colors shadow-md shadow-[#d4a853]/20">
          Start a Conversation
        </button>
      </div>

      <div className="px-1">
        <h3 className="text-sm font-bold text-slate-200 mb-3">FAQ Topics</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Software Setup', 'Billing', 'Data Issues', 'Account Management'].map((topic, i) => (
            <button key={i} className="p-4 bg-[#131c4a] border border-slate-800 rounded-xl text-left hover:border-slate-700 transition-colors">
              <span className="text-sm font-semibold text-slate-300">{topic}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountView() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center text-center pt-4 pb-2">
        <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-[#131c4a] ring-2 ring-[#d4a853] overflow-hidden flex items-center justify-center mb-4 relative shadow-xl shadow-black/50">
          <span className="text-3xl font-black text-[#d4a853]">BJ</span>
          <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm py-1.5 text-[9px] font-bold text-white tracking-widest flex justify-center items-center gap-1 border-t border-[#d4a853]/30">
            <Shield size={10} className="text-[#d4a853]" /> ADMIN
          </div>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">bjarne</h2>
        <p className="text-sm font-medium text-slate-400">bjarne@vectorvest.eu</p>
      </div>

      <div className="bg-gradient-to-br from-[#131c4a] to-[#0f172a] border border-[#d4a853]/30 rounded-2xl p-5 shadow-lg shadow-[#d4a853]/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a853]/5 rounded-full blur-3xl"></div>
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Shield size={16} className="text-[#d4a853]" />
              Member Verification
            </h3>
            <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-[80%]">Review and approve pending community member requests.</p>
          </div>
          <Badge className="bg-red-500/20 text-red-400 border border-red-500/50 shadow-sm mt-1 px-2.5 py-1">3 PENDING</Badge>
        </div>
        <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors border border-slate-700 shadow-sm relative z-10">
          Manage Requests
        </button>
      </div>

      <div className="space-y-2.5 px-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">Settings</h3>
        {[
          { label: 'Profile Information', icon: User },
          { label: 'Subscription Details', icon: Calendar },
          { label: 'Notification Preferences', icon: Bell },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} className="w-full flex items-center justify-between p-3.5 bg-[#131c4a] border border-slate-800 rounded-2xl text-slate-300 hover:bg-slate-800/50 transition-colors shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl shadow-inner">
                  <Icon size={16} className="text-slate-400" />
                </div>
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-slate-500" />
            </button>
          );
        })}
      </div>
      
      <div className="pt-4 px-1">
        <button className="w-full py-4 text-red-400 font-bold text-sm bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
}

// Simple Badge fallback since we didn't import it
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full text-xs font-bold transition-colors ${className}`}>
      {children}
    </span>
  );
}
