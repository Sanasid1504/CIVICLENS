import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added this
import { useAuth } from '../../context/AuthContext';
import ReportModal from '../Components/ReportModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { LogOut, MapPin, Sparkles, ShieldCheck, Zap, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // Initialize navigate
  const [isModalOpen, setIsModalOpen] = useState(false);

  const successStories = [
    { id: 1, before: "/garbagesea.jpeg", after: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", text: "River cleaned within 24hr" },
    { id: 2, before: "/roadpot.jpeg", after: "/cleanroad.jpeg", text: "Potholes cleared from the road" },
    { id: 3, before: "/garbagepark.jpeg", after: "/cleanpark.jpeg", text: "Public park restored" }
  ];

  return (
    <div className="min-h-screen bg-[#020604] text-gray-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* --- PREMIUM BACKGROUND GRADIENTS --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-green-900/5 blur-[100px] rounded-full" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#08100d]/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-[0.2em]"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end text-right">
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active Citizen</p>
              <span className="text-sm font-medium text-white/80">{user?.username || user?.email?.split('@')[0]}</span>
            </div>
            <button 
              onClick={logout} 
              className="p-2 hover:bg-red-500/10 text-red-400 rounded-full transition-all group"
              title="Logout"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* --- HERO SECTION --- */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight">
            Help improve your <br/> <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent italic">Community.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Directly impact your surroundings by reporting issues to local authorities in real-time.
          </p>
        </section>

        {/* --- SUCCESS STORIES CAROUSEL --- */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">Recent Impact</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-16"
          >
            {successStories.map((story) => (
              <SwiperSlide key={story.id}>
                <div className="bg-[#08100d] border border-white/5 rounded-[3rem] p-4 group transition-all hover:border-emerald-500/30">
                  <div className="flex flex-col md:flex-row gap-4 h-auto md:h-80">
                    <div className="relative flex-1 rounded-[2rem] overflow-hidden min-h-[200px]">
                      <img src={story.before} className="w-full h-full object-cover filter grayscale opacity-60 group-hover:opacity-100 transition-all duration-700" alt="Before" />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black uppercase border border-white/10">Before</div>
                    </div>
                    <div className="relative flex-1 rounded-[2rem] overflow-hidden border border-emerald-500/20 min-h-[200px]">
                      <img src={story.after} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="After" />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-600 rounded-full text-[9px] font-black uppercase shadow-lg">After</div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <p className="text-emerald-400 font-bold italic tracking-wide">"{story.text}"</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* --- CENTRAL ACTION HUB --- */}
        <section className="relative py-20 px-8 bg-gradient-to-br from-[#0a1a14] to-[#040a08] rounded-[4rem] border border-emerald-500/20 text-center overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">Ready to make a difference?</h2>
            <p className="text-gray-400 mb-12 max-w-lg mx-auto leading-relaxed italic">
              "Every report counts towards a better city."
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:shadow-[0_0_60px_rgba(16,185,129,0.4)] active:scale-95"
            >
              Report an issue
              <Zap size={18} className="group-hover:fill-current transition-all" />
            </button>
          </div>
        </section>

        {/* --- FEATURE GRID --- */}
        <section className="grid md:grid-cols-3 gap-8 mt-24 pb-20">
          <FeatureCard 
            icon={<MapPin className="text-emerald-500" />} 
            title="Precise Location" 
            desc="Automatic GPS tagging ensures authorities find the issue instantly." 
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-emerald-500" />} 
            title="Accountability" 
            desc="Full audit trail for every report. Know who is fixing your city." 
          />
          <FeatureCard 
            icon={<Sparkles className="text-emerald-500" />} 
            title="Civic Points" 
            desc="Earn rewards and rank higher by contributing to your neighborhood." 
          />
        </section>
      </main>

      {/* --- MODAL --- */}
      <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* --- CUSTOM SWIPER/SCROLLBAR STYLES --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .swiper-pagination-bullet { background: rgba(255,255,255,0.1) !important; opacity: 1 !important; }
        .swiper-pagination-bullet-active { background: #10b981 !important; width: 24px !important; border-radius: 4px !important; transition: all 0.3s !important; }
        .swiper-button-next, .swiper-button-prev { color: #10b981 !important; transform: scale(0.5); opacity: 0.5; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #020604; }
        ::-webkit-scrollbar-thumb { background: #08100d; border-radius: 10px; border: 2px solid #020604; }
        ::-webkit-scrollbar-thumb:hover { background: #10b981; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-[#08100d] p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all group shadow-xl">
    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold uppercase text-[10px] tracking-[0.2em] text-emerald-500 mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default UserDashboard;