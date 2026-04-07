import React, { useEffect, useMemo, useState } from 'react';
import Apiclient from '../api/Api';
import { Slab } from 'react-loading-indicators';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Search, User,
  TrendingUp, Award, X
} from 'lucide-react';

const CommunityFeed = () => {
  const navigate = useNavigate();
  const [feedReports, setFeedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Reported Issues');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await Apiclient.get("/civilian/posts");

        const mapped = res.data.map(p => ({
          id: p.id,
          before_img: p.before_img,
          after_img: p.after_img,
          desc: p.title,
          title: p.title,
          user: `Authority ${p.authority_id}`,
          status: "RESOLVED",
          location: "Updated by Authority",
          time: "Recently"
        }));

        setFeedReports(mapped);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  const filteredReports = useMemo(() => {
    return feedReports.filter(r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [feedReports, searchQuery]);
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        <Slab color="#006e39" size="medium" text="" textColor="" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#050d0a] text-gray-200 font-instrument selection:bg-emerald-500/30 relative overflow-x-hidden">

      {/* --- BRANDED NAVBAR --- */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050d0a]/80 px-4 md:px-12 py-4">
        <div className="max-w-10xl mx-auto flex items-center justify-between gap-4 md:gap-12">

          {/* Left: Back & Logo */}
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={() => navigate('/')} className="p-2.5 bg-white/5 hover:bg-emerald-500/20 rounded-full transition-all text-gray-400 hover:text-emerald-400">
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img
                src="logo.png"
                alt="CivicLens Logo"
                className="h-6 md:h-9 w-auto object-contain"
              />
              <span className="hidden sm:block text-white text-lg md:text-xl font-bold tracking-widest uppercase italic">
                CIVICLENS
              </span>
            </div>
          </div>

          {/* Right: Search Bar */}
          <div className="flex-1 max-w-7xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by issue or location..."
              className="w-full bg-[#0a1a14] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:ring-1 ring-[#00592E] transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-10xl mx-auto px-4 md:px-8 py-6 md:py-10 grid grid-cols-12 gap-6 md:gap-10">

        {/* --- LEFT SIDEBAR --- */}
        <aside className="col-span-12 lg:col-span-3 space-y-6 hidden md:block">
          <div className="bg-[#08100d] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-emerald-500" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">District Impact</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span className="text-gray-500">Live Resolution Rate</span>
                <span className="text-emerald-400">Increasing day by day</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#00592E] to-emerald-400 h-full w-[84%]" />
              </div>
            </div>
          </div>

          
        </aside>

        {/* --- MAIN FEED --- */}
        <section className="col-span-12 lg:col-span-9 space-y-6">
          <div className="flex gap-6 md:gap-10 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
            {['Reported Issues'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] md:text-sm font-black uppercase tracking-[0.2em] relative pb-2 transition-all ${activeTab === tab ? 'text-emerald-400' : 'text-gray-600'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00592E] rounded-full" />}
              </button>
            ))}
          </div>

          <div className="space-y-6 md:space-y-8">
            {filteredReports.length > 0 ? filteredReports.map((report, i) => (
              <FeedCard key={report.id || i} report={report} />
            )) : (
              <div className="py-32 text-center border border-dashed border-white/10 rounded-[3rem] bg-[#08100d]/30">
                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={24} className="text-gray-600" />
                </div>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.3em]">No community reports found</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; }` }} />
    </div>
  );
};

const FeedCard = ({ report }) => {
  return (
    <div className="bg-[#08100d] border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden hover:border-emerald-500/20 transition-all duration-500 group shadow-2xl">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-[350px]  lg:h-auto shrink-0 relative overflow-hidden bg-black">
          <div className="w-full h-full grid grid-cols-2">
          <img
            src={report.before_img}
            className="w-full h-full object-cover filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
            alt="Before"
            onError={(e) => e.target.src = "https://images.unsplash.com/photo-1599396784534-31599544464c?q=80&w=2000"}
          />
          <img
            src={report.after_img}
            className="w-full h-full object-cover filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
            alt="After"
            onError={(e) => e.target.src = "https://images.unsplash.com/photo-1599396784534-31599544464c?q=80&w=2000"}
          />
        </div>

        <div className="absolute top-2 left-2 text-[8px] bg-black/60 px-2 py-1 rounded text-white font-bold">
          BEFORE
        </div>
        <div className="absolute top-2 right-2 text-[8px] bg-emerald-600 px-2 py-1 rounded text-white font-bold">
          AFTER
        </div>
        <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md shadow-2xl ${report.status === 'RESOLVED' ? 'bg-[#00592E] text-white' : 'bg-[#0a1a14] text-emerald-400'}`}>
          {report.status || 'PENDING'}
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                <User size={16} className="text-emerald-500" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-white/70">
                {report.user || 'Anonymous Citizen'}
              </span>
            </div>
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{report.time || 'Recently'}</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-tight italic">
            {report.title}
          </h3>

          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 w-fit">
            <MapPin size={14} className="text-[#00592E]" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {report.location}
            </span>
          </div>

         
        </div>
      </div>
    </div>
    </div >
  );
};

const ContributorItem = ({ name, level, points }) => (
  <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-3 rounded-2xl transition-all">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-sm text-emerald-500 group-hover:bg-[#00592E] group-hover:text-white transition-all">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-xs font-black text-white leading-none">{name}</p>
        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1.5">{level}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-[10px] font-mono text-[#00592E] font-bold">{points}</p>
      <p className="text-[7px] text-gray-700 uppercase font-black">Points</p>
    </div>
  </div>
);

export default CommunityFeed;