import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../../context/ReportContext';
import { 
  ArrowLeft, MapPin, ThumbsUp, Plus, 
  Search, MessageSquare, CheckCircle2, 
  Clock, Send, X, BellRing, User
} from 'lucide-react';

const CommunityFeed = () => {
  const navigate = useNavigate();
  const { reports } = useReports();
  const [activeTab, setActiveTab] = useState('Reported Issues');
  const [notification, setNotification] = useState(null);

  const feedReports = useMemo(() => {
    return [...reports].reverse();
  }, [reports]);

  const triggerNotification = (userName) => {
    setNotification(`You are now following the issue of ${userName}`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#050d0a] text-gray-200 font-sans selection:bg-emerald-500/30 no-scrollbar relative overflow-x-hidden">
      
      {/* --- SIDE NOTIFICATION --- */}
      {notification && (
        <div className="fixed top-10 right-10 z-[100] animate-in slide-in-from-right duration-500">
          <div className="bg-[#08100d] border border-emerald-500/40 p-5 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] flex items-center gap-4 min-w-[350px] backdrop-blur-md">
            <div className="bg-emerald-500/20 p-2 rounded-full animate-bounce">
              <BellRing size={20} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Subscription Updated</p>
              <p className="text-sm font-bold text-white">{notification}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#08100d]/80 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-500 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-black text-white uppercase tracking-widest hidden md:block">
              CIVIC<span className="text-emerald-500">FEED</span>
            </h1>
          </div>

          <div className="flex-1 max-w-5xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Search issues in Navi Mumbai..." className="w-full bg-[#16221d] border-none rounded-2xl py-3 pl-12 text-sm text-white outline-none focus:ring-1 ring-emerald-500" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-12 gap-10">
        
        {/* --- LEFT SIDEBAR --- */}
        <aside className="col-span-12 lg:col-span-3 space-y-8">
          <div className="bg-[#08100d] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">District Impact</h3>
            <div className="rounded-2xl overflow-hidden h-32 border border-white/5 bg-black flex items-center justify-center relative">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
               <MapPin className="text-emerald-500 animate-pulse" size={32} />
            </div>
            <div className="space-y-4">
               <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
                  <span>Resolution Rate</span>
                  <span className="text-emerald-400">84%</span>
               </div>
               <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[84%]" /></div>
            </div>
          </div>

          <div className="bg-[#08100d] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-6">Top Citizens</h3>
            <div className="space-y-6">
               <ContributorItem name="Jane Doe" level="Level 4" points="1.2k" />
               <ContributorItem name="Mike Smith" level="Reporter" points="892" />
               <ContributorItem name="Sana Siddiqui" level="Guardian" points="750" />
            </div>
          </div>
        </aside>

        {/* --- MAIN FEED --- */}
        <section className="col-span-12 lg:col-span-9 space-y-8">
          <div className="flex gap-8 border-b border-white/5 pb-6">
            {['Reported Issues', 'Improvement Suggestions'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`text-sm font-black uppercase tracking-widest relative pb-2 transition-all ${activeTab === tab ? 'text-white' : 'text-gray-600'}`}>
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500" />}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {feedReports.length > 0 ? feedReports.map((report, i) => (
              <FeedCard 
                key={report.id || i} 
                report={report} 
                onFollow={() => triggerNotification(report.user || 'Unknown User')} 
              />
            )) : (
              <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-gray-700 font-black uppercase text-[10px] tracking-widest">
                Scanning for community reports...
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

// --- FEED CARD ---

const FeedCard = ({ report, onFollow }) => {
  const [likes, setLikes] = useState(() => Math.floor(Math.random() * 300) + 12);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    { user: "Authority Bot", text: "Report received. Awaiting officer assignment." }
  ]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([...comments, { user: "You", text: commentText }]);
    setCommentText("");
  };

  return (
    <div className="bg-[#08100d] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/20 transition-all group shadow-xl">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-80 h-64 shrink-0 relative overflow-hidden bg-black">
          <img src={report.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" alt="Issue" />
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[8px] font-black uppercase border border-white/10 backdrop-blur-md ${report.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-orange-500'}`}>
            {report.status || 'PENDING'}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
             <div className="flex justify-between items-center mb-4">
                {/* USER IDENTITY IN FEED */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <User size={12} className="text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        {report.user || 'Anonymous'}
                    </span>
                </div>
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{report.time || 'Recently'}</span>
             </div>
             
             <h3 className="text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-emerald-400 transition-colors leading-none">
                {report.title}
             </h3>
             <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 flex items-center gap-1">
                <MapPin size={12} className="text-emerald-500" /> {report.location}
             </p>
             <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 italic">"{report.desc}"</p>
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
             <div className="flex items-center gap-6">
                <button onClick={() => { setLikes(prev => isLiked ? prev - 1 : prev + 1); setIsLiked(!isLiked); }} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isLiked ? 'text-emerald-500' : 'text-gray-500 hover:text-white'}`}>
                   <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} /> {likes}
                </button>
                <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${showComments ? 'text-blue-400' : 'text-gray-500 hover:text-white'}`}>
                   <MessageSquare size={16} /> {comments.length}
                </button>
             </div>
             <button onClick={onFollow} className="flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                <Plus size={14} /> Follow Issue
             </button>
          </div>
        </div>
      </div>

      {/* --- COMMENTS --- */}
      {showComments && (
        <div className="bg-black/20 p-8 border-t border-white/5 animate-in fade-in duration-300">
           <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Citizen Discussion</h4>
              <button onClick={() => setShowComments(false)}><X size={14} className="text-gray-600 hover:text-white"/></button>
           </div>
           <div className="space-y-4 max-h-40 overflow-y-auto no-scrollbar mb-6">
              {comments.map((c, idx) => (
                <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">{c.user}</p>
                  <p className="text-xs text-gray-300">{c.text}</p>
                </div>
              ))}
           </div>
           <form onSubmit={handleAddComment} className="flex gap-2">
              <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add to the discussion..." className="flex-1 bg-[#16221d] border-none rounded-xl p-3 text-xs text-white outline-none" />
              <button type="submit" className="bg-emerald-600 p-3 rounded-xl text-white hover:bg-emerald-500 transition-all"><Send size={16} /></button>
           </form>
        </div>
      )}
    </div>
  );
};

const ContributorItem = ({ name, level, points }) => (
  <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
    <div className="flex items-center gap-4">
       <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center font-bold text-xs text-emerald-500">{name.charAt(0)}</div>
       <div>
          <p className="text-xs font-bold text-white leading-none">{name}</p>
          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter mt-1">{level}</p>
       </div>
    </div>
    <span className="text-[9px] font-mono text-gray-500">{points}</span>
  </div>
);

export default CommunityFeed;