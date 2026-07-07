import React, { useState } from "react";
import { 
  PlayCircle, BookOpen, Calendar, MessageSquare, 
  Settings, Users, Shield, Search, Bell, ChevronRight,
  Send, MoreVertical, ThumbsUp, Paperclip, Clock, Play
} from "lucide-react";

export default function LearningHub() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans text-slate-900">
      {/* Top Navigation */}
      <header className="flex-none h-16 bg-[#0f172a] flex items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center gap-8">
          {/* Logo Placeholder */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#d4a853] rounded flex items-center justify-center font-bold text-slate-900 text-xl">
              V
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">VectorVest</span>
          </div>

          {/* Primary Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavItem active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<BookOpen size={16} />} label="University Hub" />
            <NavItem active={activeTab === "webinar"} onClick={() => setActiveTab("webinar")} icon={<PlayCircle size={16} />} label="Webinars" />
            <NavItem active={activeTab === "events"} onClick={() => setActiveTab("events")} icon={<Calendar size={16} />} label="Events" />
            <NavItem active={activeTab === "support"} onClick={() => setActiveTab("support")} icon={<MessageSquare size={16} />} label="Support" />
          </nav>
        </div>

        {/* User / Admin Controls */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853] w-48"
            />
          </div>
          <button className="text-slate-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute 0 right-0 w-2 h-2 bg-[#d4a853] rounded-full"></span>
          </button>
          <div className="h-6 w-px bg-slate-700 mx-2"></div>
          
          <button className="flex items-center gap-3 hover:bg-slate-800 p-1 pr-3 rounded-full transition-colors border border-slate-800 hover:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
              BJ
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-white leading-tight">Bjarne</span>
              <span className="text-xs text-[#d4a853] flex items-center gap-1 font-medium leading-tight">
                <Shield size={10} /> Admin
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left/Center Column - Learning Hub Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <div className="max-w-5xl mx-auto p-8 flex flex-col gap-8">
            
            {/* Page Header */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Learning Hub</h1>
                <p className="text-slate-500 mt-1">Pick up where you left off and join upcoming sessions.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-md transition-colors flex items-center gap-2">
                  <Users size={16} /> Member Verification
                </button>
              </div>
            </div>

            {/* Hero Card - Next Live Webinar */}
            <div className="relative bg-[#0f172a] rounded-xl overflow-hidden shadow-xl border border-slate-800">
              {/* Abstract decorative graphic */}
              <div className="absolute top-0 right-0 w-96 h-full opacity-20 pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-[#d4a853]">
                  <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.4,-46.4C91,-33.6,97.3,-18.2,96.3,-3.3C95.3,11.6,87,26.1,77.3,39.3C67.6,52.4,56.5,64.2,43.3,73C30.2,81.9,15.1,87.7,0.4,87.1C-14.4,86.4,-28.7,79.2,-41.8,70.5C-54.8,61.8,-66.6,51.6,-74.6,39.2C-82.6,26.8,-86.7,12.2,-86.3,-2.2C-85.9,-16.5,-80.9,-30.5,-73.2,-42.6C-65.5,-54.6,-55.1,-64.7,-42.6,-72.6C-30.1,-80.5,-15.1,-86.3,-0.1,-86.2C14.9,-86,29.9,-84,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
              </div>

              <div className="relative z-10 p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a853]/20 text-[#d4a853] text-xs font-semibold mb-4 border border-[#d4a853]/30">
                    <span className="w-2 h-2 rounded-full bg-[#d4a853] animate-pulse"></span>
                    STARTING IN 45 MINS
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Market Outlook &amp; Technical Setups</h2>
                  <p className="text-slate-300 mb-6 text-sm max-w-lg leading-relaxed">
                    Join our head instructors as we analyze current market conditions, review the proprietary timing signals, and build a watchlist for the upcoming week.
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-3 bg-[#d4a853] hover:bg-[#e1b95e] text-[#0f172a] font-semibold rounded-md transition-colors flex items-center gap-2 shadow-lg shadow-[#d4a853]/20">
                      <Play size={18} fill="currentColor" /> Enter Webinar Room
                    </button>
                    <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-md transition-colors border border-slate-700">
                      View Syllabus
                    </button>
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                  <div className="bg-slate-800/80 backdrop-blur rounded-lg p-4 border border-slate-700/50">
                    <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">Instructors</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <img src="https://i.pravatar.cc/100?img=11" className="w-10 h-10 rounded-full border-2 border-slate-800" alt="Inst" />
                        <img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full border-2 border-slate-800" alt="Inst" />
                      </div>
                      <div className="text-sm text-slate-200">
                        <span className="font-medium text-white">Susan B. &amp; Mark T.</span>
                        <div className="text-xs text-slate-400">Senior Analysts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Courses Section */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="text-[#d4a853]" size={20} /> Your University Progress
                  </h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    All Courses <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CourseCard 
                    title="Options Trading 101" 
                    module="Module 3: Covered Calls" 
                    progress={65} 
                    image="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400&h=250"
                  />
                  <CourseCard 
                    title="Value Investing Framework" 
                    module="Module 1: Reading Balance Sheets" 
                    progress={12} 
                    image="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400&h=250"
                  />
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="text-[#d4a853]" size={20} /> Upcoming Events
                </h3>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <EventItem day="12" month="OCT" title="Amsterdam User Group Meetup" location="Amsterdam, NL" />
                  <EventItem day="15" month="OCT" title="Live Q&A: Q3 Earnings" location="Online Virtual Event" />
                  <EventItem day="28" month="OCT" title="Brussels Trading Workshop" location="Brussels, BE" isLast />
                </div>
              </div>

            </div>
            
            {/* Space to scroll */}
            <div className="h-12"></div>
          </div>
        </main>

        {/* Right Sidebar - Main Room Chat Layer */}
        <aside className="w-80 lg:w-96 bg-white border-l border-slate-200 flex flex-col flex-none shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0">
            <div>
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-[#0f172a]" /> Main Room
              </h2>
              <p className="text-xs text-slate-500">General Discussion • 244 online</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={18} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 bg-slate-50/50">
            {/* Chat Messages */}
            <ChatMessage 
              user="Tom Peeters" 
              time="10:14 AM" 
              content="Just reviewed the VST scores for the semiconductor sector. Looking incredibly bullish today." 
              avatar="https://i.pravatar.cc/100?img=33" 
            />
            <ChatMessage 
              user="Sarah De Vries" 
              time="10:16 AM" 
              content="Agreed Tom! Is anyone planning to attend the webinar at 11? Susan usually drops some great picks during the Q&A." 
              avatar="https://i.pravatar.cc/100?img=47" 
            />
            
            {/* System / Admin Message */}
            <div className="bg-[#0f172a] rounded-lg p-4 text-white text-sm shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#d4a853]"></div>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-[#d4a853]" />
                <span className="font-semibold">Bjarne (Admin)</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                Reminder: The "Market Outlook" webinar starts in 45 mins. You can enter the room via the Hub header. Have your questions ready!
              </p>
            </div>

            <ChatMessage 
              user="Jan Jansen" 
              time="10:22 AM" 
              content="Thanks Bjarne. Will be there. Did anyone catch the drop on ASML yesterday?" 
              avatar="https://i.pravatar.cc/100?img=15" 
            />
            
            <ChatMessage 
              user="Tom Peeters" 
              time="10:25 AM" 
              content="Yeah, bought the dip. The fundamentals haven't changed according to the latest VV report." 
              avatar="https://i.pravatar.cc/100?img=33" 
            />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="bg-slate-100 rounded-lg border border-slate-200 p-2 focus-within:border-slate-300 focus-within:ring-1 focus-within:ring-slate-300 transition-shadow">
              <textarea 
                className="w-full bg-transparent border-none focus:outline-none resize-none text-sm text-slate-800 placeholder-slate-400 p-1"
                placeholder="Type your message..."
                rows={2}
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-1 text-slate-400">
                  <button className="p-1.5 hover:bg-slate-200 hover:text-slate-600 rounded"><Paperclip size={16} /></button>
                </div>
                <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white p-1.5 px-3 rounded text-sm font-medium flex items-center gap-2 transition-colors">
                  <Send size={14} /> Send
                </button>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

// Sub-components

function NavItem({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-5 text-sm font-medium border-b-2 transition-colors ${
        active 
          ? "border-[#d4a853] text-[#d4a853]" 
          : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function CourseCard({ title, module, progress, image }: { title: string, module: string, progress: number, image: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer flex flex-col">
      <div className="h-32 bg-slate-200 relative overflow-hidden">
        <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-[#d4a853] hover:text-[#0f172a] transition-colors border border-white/40">
          <Play size={14} fill="currentColor" />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
        <p className="text-xs text-slate-500 mb-4 line-clamp-1">{module}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#d4a853] rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventItem({ day, month, title, location, isLast }: { day: string, month: string, title: string, location: string, isLast?: boolean }) {
  return (
    <div className={`flex gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-colors ${!isLast ? 'border-b border-slate-100' : ''}`}>
      <div className="flex flex-col items-center justify-center bg-slate-100 rounded-lg w-12 h-14 border border-slate-200 flex-none text-[#0f172a]">
        <span className="text-xs font-bold uppercase text-slate-500 leading-none mb-1">{month}</span>
        <span className="text-lg font-bold leading-none">{day}</span>
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 text-sm mb-1">{title}</h4>
        <p className="text-xs text-slate-500 flex items-center gap-1">
           {location}
        </p>
      </div>
    </div>
  );
}

function ChatMessage({ user, time, content, avatar }: { user: string, time: string, content: string, avatar: string }) {
  return (
    <div className="flex gap-3 group">
      <img src={avatar} alt={user} className="w-8 h-8 rounded-full border border-slate-200 mt-1 flex-none" />
      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-sm text-slate-900">{user}</span>
          <span className="text-[10px] text-slate-400 font-medium">{time}</span>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-tr-xl rounded-b-xl text-sm text-slate-700 shadow-sm leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}
