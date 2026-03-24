import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowRight, MapPin, BarChart3, Lightbulb, 
  LayoutDashboard, LogOut, ChevronDown, LogIn, ShieldCheck,
  Settings, Clock 
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { useAuth } from "../../context/AuthContext";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Local Images
import ForestRoad from "../_3.jpeg";
import Underwater from "../At.jpeg";
import Lamppost from "../Lamppost.jpeg";
import Flood from "../download.jpeg";

const CivicLensLanding = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isLoggedIn = !!user;
  const isAdminOrAuth = user?.role === "Admin" || user?.role === "Government Authority";

  const handleRoleBasedRedirect = () => {
    if (!isLoggedIn) { navigate("/signup"); return; }
    if (user.role === "Admin") navigate("/admin");
    else if (user.role === "Government Authority") navigate("/authority");
    else navigate("/user-home");
  };

  const handleDashboardLink = () => {
    if (user?.role === "Admin") navigate("/admin");
    else if (user?.role === "Government Authority") navigate("/authority");
    else navigate("/user-stats");
  };

  const handleComplaintsClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) handleRoleBasedRedirect();
    else navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const galleryImages = [
    { src: ForestRoad, alt: "Infrastructure Issues" },
    { src: Underwater, alt: "Environmental Concerns" },
    { src: Lamppost, alt: "Utility Maintenance" },
    { src: Flood, alt: "Urban Flooding" },
  ];

  return (
    <div className="relative min-h-screen bg-[#050d0a] text-white font-instrument flex flex-col overflow-x-hidden">
      
      {/* Background Blurs */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-emerald-900/20 blur-[150px] rounded-full" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="flex justify-center py-8 px-4 w-full relative z-50">
        <div className="bg-white/5 backdrop-blur-2xl rounded-full px-10 py-2 flex items-center justify-between border border-white/10 text-sm font-medium text-gray-300 shadow-2xl w-full max-w-6xl">
          <div className="flex items-center pr-8 border-r border-white/10">
            <div className={`flex items-center ${isAdminOrAuth ? 'gap-24' : 'gap-8 md:gap-16'}`}>
              <Link to="/about" className="hover:text-emerald-400 transition-colors uppercase tracking-widest text-[10px]">About</Link>
              {!isAdminOrAuth && (
                <>
                  <button onClick={handleComplaintsClick} className="hover:text-emerald-400 transition-colors uppercase tracking-widest text-[10px] bg-transparent border-none cursor-pointer">Complaints</button>
                  <Link to="/community" className="hover:text-emerald-400 transition-colors uppercase tracking-widest text-[10px]">Feed</Link>
                </>
              )}
              <Link to="/help" className="hover:text-emerald-400 transition-colors uppercase tracking-widest text-[10px]">Help</Link>
            </div>
          </div>

          {!isLoggedIn ? (
            <div className="flex items-center gap-6">
              <Link to="/login" className="hover:text-emerald-400 transition-colors uppercase tracking-widest text-[10px] flex items-center gap-2"><LogIn size={14}/> Login</Link>
              <button onClick={() => navigate("/signup")} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all">Join Now</button>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 pl-2 pr-4 py-1.5 rounded-full transition-all">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-black shadow-lg">
                  {(user.username?.[0] || user.email[0]).toUpperCase()}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:block">My Account</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-4 w-64 bg-[#0b1410] border border-white/10 rounded-[1.5rem] p-4 shadow-2xl z-50">
                  <div className="px-2 pb-4 border-b border-white/5 mb-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <span className="text-[9px] bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-bold mt-2 inline-block">{user.role}</span>
                  </div>
                  <button onClick={handleDashboardLink} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-xl transition-colors text-xs text-gray-300">
                    <LayoutDashboard size={16} className="text-emerald-500" /> 
                    {user.role === "Admin" ? "System Admin Portal" : user.role === "Government Authority" ? "Authority Portal" : "My Analytics"}
                  </button>
                  <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-900/10 rounded-xl transition-colors text-xs text-red-400 font-bold">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative max-w-5xl mx-auto text-center pt-24 pb-20 px-4">
        <h1 className="text-4xl md:text-8xl font-medium tracking-tighter mb-4 text-white uppercase leading-none italic">CIVICLENS</h1>
        <p className="text-xl md:text-4xl italic font-light mb-8 tracking-tight text-emerald-100/60 leading-tight">"From Complaint to Resolution — With Accountability."</p>
        <p className="text-[10px] md:text-xs text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed uppercase tracking-widest italic font-light">
          Report issues, follow their status in real-time, and know exactly who's responsible.
        </p>
        {!isLoggedIn ? (
          <button onClick={() => navigate("/signup")} className="bg-[#00592E] hover:bg-emerald-600 text-white px-16 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-lg active:scale-95 transition-all">Get Started Now</button>
        ) : (
          <button onClick={handleRoleBasedRedirect} className="bg-emerald-600 hover:bg-emerald-500 text-white px-16 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-lg active:scale-95 transition-all flex items-center gap-3 mx-auto">
            {user.role === "Admin" ? <Settings size={18} /> : <ShieldCheck size={18} />} Go to {user.role} Portal
          </button>
        )}
      </header>

      {/* --- CAROUSEL --- */}
      <section className="mb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Swiper modules={[Pagination, Autoplay, Navigation]} spaceBetween={30} slidesPerView={1} loop={true} autoplay={{ delay: 3000 }} pagination={{ clickable: true }} navigation={true} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}>
            {galleryImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="h-[400px] rounded-[2.5rem] overflow-hidden border border-white/10 relative group">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-emerald-400 font-bold uppercase text-xs tracking-widest">{img.alt}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* --- METRICS SECTION --- */}
      <section className="px-6 mb-40">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2 uppercase tracking-tighter italic text-white">Accountability You Can Measure</h2>
          <p className="text-gray-500 text-[10px] mb-16 font-light tracking-widest uppercase italic">Real metrics from real resolutions. No hidden data, no empty promises.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16">
            {[
              { label: "Active users & growing", value: "15000+" },
              { label: "Resolution rate in 2026", value: "92%" },
              { label: "Average response time", value: "2.4 Days" },
              { label: "Transparency", value: "100%" }
            ].map((s, i) => (
              <div key={i} className="bg-[#0a1a14] border border-white/5 p-10 rounded-2xl h-52 flex flex-col justify-center transition-all hover:border-emerald-500/30">
                <div className="text-3xl font-bold text-white mb-2">{s.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- READY TO MAKE A DIFFERENCE SECTION (The Split Layout) --- */}
      <section className="max-w-6xl mx-auto w-full px-6 mb-40 flex flex-col md:flex-row gap-20">
        <div className="flex-1">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6 uppercase tracking-tighter italic">Ready to Make a Difference?</h2>
          <p className="text-gray-400 text-lg font-light mb-10 max-w-md italic">Join thousands of citizens who are actively shaping their communities. Your voice matters.</p>
          <button onClick={() => navigate("/signup")} className="bg-[#00381d] hover:bg-[#00592E] text-white px-8 py-3 rounded-lg text-sm font-bold flex items-center gap-2 border border-emerald-900/50 uppercase tracking-widest italic transition-all">
            Get Started Free <ArrowRight size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <FeatureCard 
            title="Pin Your Issue" 
            desc="Use GPS or search to mark the exact location of the problem." 
            icon={<MapPin size={20} className="text-emerald-500" />} 
          />
          <FeatureCard 
            title="Track Progress" 
            desc="Watch your report move through stages from submission to resolution." 
            icon={<Clock size={20} className="text-emerald-500" />} 
          />
          <FeatureCard 
            title="Share Ideas" 
            desc="Suggest improvements and vote on community proposals." 
            icon={<Lightbulb size={20} className="text-emerald-500" />} 
          />
        </div>
      </section>

      {/* --- FOOTER (4 Column Layout) --- */}
      <footer className="bg-[#020705] border-t border-white/5 py-20 px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-gray-600">
          <div>
            <h3 className="font-bold text-white mb-4 uppercase italic tracking-widest">CIVICLENS</h3>
            <p className="text-xs italic font-light leading-relaxed">Transparent civic engagement for a better community.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white mb-6 uppercase tracking-widest">Platform</h4>
            <ul className="text-[10px] space-y-3 uppercase tracking-tighter font-medium">
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Impact Map</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Report Issue</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Idea Lab</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white mb-6 uppercase tracking-widest">Resources</h4>
            <ul className="text-[10px] space-y-3 uppercase tracking-tighter font-medium">
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">About us</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Community Guidelines</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Help Center</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white mb-6 uppercase tracking-widest">Transparency</h4>
            <ul className="text-[10px] space-y-3 uppercase tracking-tighter font-medium">
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Terms of Service</li>
            </ul>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .swiper-pagination-bullet { background: #10b981 !important; opacity: 0.3; }
        .swiper-pagination-bullet-active { opacity: 1; width: 30px; border-radius: 4px; transition: width 0.3s; }
        .swiper-button-next, .swiper-button-prev { color: #10b981 !important; transform: scale(0.6); }
      `}} />
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }) => (
  <div className="bg-gradient-to-r from-[#0a1a14] to-transparent p-8 rounded-2xl border-l-4 border-emerald-800 hover:translate-x-2 transition-transform duration-300">
    <div className="flex gap-6 items-start">
      <div className="p-3 bg-emerald-950 rounded-xl border border-emerald-800/50">{icon}</div>
      <div>
        <h4 className="font-bold text-xl mb-2 uppercase tracking-tighter italic text-white">{title}</h4>
        <p className="text-[10px] text-gray-500 font-light uppercase tracking-widest italic leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

export default CivicLensLanding;