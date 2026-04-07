import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportModal from '../Components/ReportModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { LogOut, MapPin, Sparkles, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import Apiclient from '../api/Api';
import { Slab } from "react-loading-indicators";
// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const UserDashboard = () => {
  const [loading, setLoading] = useState(true); // start as true
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const successStories = [
    { id: 1, before: "garbagesea.jpeg", after: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", text: "River cleaned within 24hr" },
    { id: 2, before: "roadpot.jpeg", after: "cleanroad.jpeg", text: "Potholes cleared from the road" },
    { id: 3, before: "garbagepark.jpeg", after: "cleanpark.jpeg", text: "Public park restored" }
  ];
  const logout = () => {
    localStorage.clear();
    navigate("/");
  }
  const checkUser = async () => {
  const token = localStorage.getItem("Token");


  if (!token) {
    setIsAuthenticated(false);
    setLoading(false);
    navigate("/login");
    return;
  }

  try {
    const response = await Apiclient.get("/user/me", {
      headers: {
        Authorization: token,
      },
    });

    setUsername(response.data.name);
    setIsAuthenticated(true);

  } catch (err) {
    console.log(err);

    // invalid / expired token
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/login");

  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    checkUser()
  }, [])
if (loading) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <Slab color="#006e39" size="medium" text="" textColor="" />
    </div>
  );
}

if (!isAuthenticated) {
  return null; // prevent UI flash
}
  return (
    <div className="min-h-screen bg-[#020604] text-gray-200 font-instrument selection:bg-emerald-500/30 overflow-x-hidden">

      {/* --- PREMIUM BACKGROUND GRADIENTS --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-green-900/5 blur-[100px] rounded-full" />
      </div>

      {/* --- BRANDED NAVBAR --- */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#08100d]/80 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Left: Back Button + Logo */}
          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-all uppercase text-[9px] md:text-[10px] font-black tracking-[0.2em]"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img
                src="logo.png"
                alt="CivicLens Logo"
                className="h-6 md:h-8 w-auto object-contain"
              />
              <span className="hidden sm:block text-white text-lg font-bold tracking-widest uppercase italic">
                CIVICLENS
              </span>
            </div>
          </div>

          {/* Right: User Profile & Logout */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex flex-col items-end text-right">
              <p className="text-[8px] md:text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active Citizen</p>
              <span className="text-xs md:text-sm font-medium text-white/80 truncate max-w-[100px] md:max-w-none">
                {username}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-red-500/10 text-red-400 rounded-full transition-all group"
            >
              <LogOut size={18} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* --- HERO SECTION --- */}
        <section className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-tight">
            Help improve your <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent italic">Community.</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-xl max-w-2xl mx-auto font-light leading-relaxed px-4 md:px-0 italic">
            Directly impact your surroundings by reporting issues to local authorities in real-time.
          </p>
        </section>

        {/* --- SUCCESS STORIES CAROUSEL --- */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-8 md:mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <h2 className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-gray-500">Recent Impact</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-12 md:pb-16"
          >
            {successStories.map((story) => (
              <SwiperSlide key={story.id}>
                <div className="bg-[#08100d] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-3 md:p-4 group transition-all hover:border-emerald-500/30 shadow-2xl">
                  <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                    <div className="relative flex-1 rounded-2xl md:rounded-[2rem] overflow-hidden aspect-video md:aspect-auto md:h-80">
                      <img src={story.before} className="w-full h-full object-cover filter grayscale opacity-60 group-hover:opacity-100 transition-all duration-700" alt="Before" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase border border-white/10">Before</div>
                    </div>
                    <div className="relative flex-1 rounded-2xl md:rounded-[2rem] overflow-hidden border border-emerald-500/20 aspect-video md:aspect-auto md:h-80">
                      <img src={story.after} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="After" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-600 rounded-full text-[8px] font-black uppercase shadow-lg">After</div>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 text-center">
                    <p className="text-emerald-400 text-xs md:text-base font-bold italic tracking-wide">"{story.text}"</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* --- CENTRAL ACTION HUB --- */}
        <section className="relative py-12 md:py-20 px-6 md:px-8 bg-gradient-to-br from-[#0a1a14] to-[#040a08] rounded-[2.5rem] md:rounded-[4rem] border border-emerald-500/20 text-center overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight uppercase">Ready to make a difference?</h2>
            <p className="text-gray-400 text-xs md:text-lg mb-8 md:mb-12 max-w-lg mx-auto leading-relaxed italic">
              "Every report counts towards a better city."
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-3 bg-[#00592E] hover:bg-[#003d1f] text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-black uppercase tracking-widest text-[10px] md:text-base transition-all shadow-[0_0_30px_rgba(0,89,46,0.3)] active:scale-95 w-full md:w-auto justify-center border border-white/10"
            >
              Report an issue
              <Zap size={16} className="md:w-5 md:h-5 group-hover:fill-current transition-all" />
            </button>
          </div>
        </section>

        {/* --- FEATURE GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-24 pb-12 md:pb-20">
          <FeatureCard
            icon={<MapPin className="text-emerald-500" size={20} />}
            title="Precise Location"
            desc="Automatic GPS tagging ensures authorities find the issue instantly."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-emerald-500" size={20} />}
            title="Accountability"
            desc="Full audit trail for every report. Know who is fixing your city."
          />
          <FeatureCard
            icon={<Sparkles className="text-emerald-500" size={20} />}
            title="Civic Points"
            desc="Earn rewards and rank higher by contributing to your neighborhood."
          />
        </section>
      </main>

      <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style dangerouslySetInnerHTML={{
        __html: `
        .swiper-pagination-bullet { background: rgba(255,255,255,0.1) !important; opacity: 1 !important; }
        .swiper-pagination-bullet-active { background: #10b981 !important; width: 24px !important; border-radius: 4px !important; transition: all 0.3s !important; }
        .swiper-button-next, .swiper-button-prev { display: none !important; }
        @media (min-width: 768px) {
          .swiper-button-next, .swiper-button-prev { display: flex !important; color: #10b981 !important; transform: scale(0.5); opacity: 0.5; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #020604; }
        ::-webkit-scrollbar-thumb { background: #08100d; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}} />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-[#08100d] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all group shadow-xl">
    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em] text-emerald-500 mb-2">{title}</h3>
    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{desc}</p>
  </div>
);

export default UserDashboard;