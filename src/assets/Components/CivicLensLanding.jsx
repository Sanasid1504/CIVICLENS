import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowRight, MapPin, BarChart3, Lightbulb, 
  LayoutDashboard, LogOut, ChevronDown, LogIn, ShieldCheck,
  Settings, Clock, Menu, X, PlusCircle
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsDropdownOpen(false);
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
    { src: Flood, alt: "Lack of greenery" },
  ];

  return (
    <div className="relative min-h-screen bg-[#050d0a] text-white font-instrument flex flex-col overflow-x-hidden">
      
      {/* Background Blurs */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-emerald-900/20 blur-[150px] rounded-full" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="flex flex-col items-center justify-center py-8 px-4 w-full relative z-50 gap-4">
        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-full px-6 md:px-10 py-3 flex items-center justify-between border border-white/5 text-sm font-medium text-gray-300 shadow-2xl w-full max-w-5xl">
          
          <div className="flex items-center gap-4 md:gap-12">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-gray-400 hover:text-white transition-colors">
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Link to="/about" className="hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] text-[9px] md:text-[10px] font-semibold">About</Link>
            
            <div className="hidden lg:flex items-center gap-12">
              {!isAdminOrAuth && (
                <>
                  <button onClick={handleComplaintsClick} className="hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] text-[10px] font-semibold bg-transparent border-none cursor-pointer">Complaints</button>
                  <Link to="/community" className="hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] text-[10px] font-semibold">Feed</Link>
                </>
              )}
              <Link to="/help" className="hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] text-[10px] font-semibold">Help</Link>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 ml-4 pl-4 md:pl-8 border-l border-white/10">
            {!isLoggedIn ? (
              <div className="flex items-center gap-3 md:gap-6">
                <Link to="/login" className="hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] text-[9px] md:text-[10px] font-semibold flex items-center gap-2">
                  <LogIn size={14}/> <span className="hidden sm:inline">Login</span>
                </Link>
                <button onClick={() => navigate("/signup")} className="bg-[#00592E] text-white px-5 py-2 rounded-full text-[9px] md:text-[10px] font-semibold uppercase tracking-tighter transition-all">
                  Join
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 p-1 rounded-full transition-all">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#00592E] flex items-center justify-center text-[10px] font-black shadow-lg">
                    {(user.username?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-4 w-56 bg-[#0b1410] border border-white/10 rounded-2xl p-4 shadow-2xl z-50">
                    <button onClick={handleDashboardLink} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-xl transition-colors text-[10px] uppercase font-bold tracking-widest text-gray-300">
                      <LayoutDashboard size={16} className="text-emerald-500" /> 
                      {user.role === "User" ? "My Dashboard" : "Portal"}
                    </button>
                    {user.role === "User" && (
                      <button onClick={() => { navigate("/user-home"); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-emerald-500/10 rounded-xl transition-colors text-[10px] uppercase font-bold tracking-widest text-emerald-400 mt-1">
                        <PlusCircle size={16} /> Make a Complaint
                      </button>
                    )}
                    <div className="my-2 border-t border-white/5" />
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-900/10 rounded-xl transition-colors text-[10px] uppercase font-bold tracking-widest text-red-400">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION WITH MATCHING BUTTON COLORS --- */}
      <header className="relative max-w-5xl mx-auto text-center pt-20 md:pt-24 pb-20 px-6 flex flex-col items-center">
        <h1 className="text-5xl md:text-8xl font-medium tracking-tighter mb-4 text-white uppercase leading-none">CIVICLENS</h1>
        <p className="text-xl md:text-4xl italic font-light mb-8 tracking-tight text-emerald-100/60 leading-tight">"From Complaint to Resolution — With Accountability."</p>
        <p className="text-[10px] md:text-xs text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed uppercase tracking-widest font-light">
          Report issues, follow their status in real-time, and know exactly who's responsible.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center items-center w-full px-4 gap-4">
          {!isLoggedIn ? (
            <button 
              onClick={() => navigate("/signup")} 
              className="bg-[#00592E] hover:bg-emerald-600 text-white px-8 md:px-16 py-4 rounded-full font-semibold uppercase tracking-widest text-[11px] md:text-sm shadow-lg active:scale-95 transition-all w-full md:w-auto max-w-[300px] md:max-w-none"
            >
              Get Started Now
            </button>
          ) : (
            <>
              {isAdminOrAuth ? (
                <button 
                  onClick={handleRoleBasedRedirect} 
                  className="bg-[#00592E] hover:bg-[#00381D] text-white px-8 md:px-20 py-4 md:py-5 rounded-full font-normal uppercase tracking-widest text-[11px] md:text-base shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 w-full md:w-auto max-w-[340px] md:max-w-none"
                >
                  <Settings size={20} /> <span>Go to {user.role} Portal</span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  {/* BOTH BUTTONS NOW USE THE SAME EMERALD GREEN THEME */}
                  <button 
                    onClick={() => navigate("/user-stats")} 
                    className="bg-[#00592E] hover:bg-emerald-600 text-white px-8 md:px-12 py-4 rounded-full font-semibold uppercase tracking-widest text-[11px] md:text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <LayoutDashboard size={18}/> My Dashboard
                  </button>
                  <button 
                    onClick={() => navigate("/user-home")} 
                    className="bg-[#00592E] hover:bg-emerald-600 text-white px-8 md:px-12 py-4 rounded-full font-semibold uppercase tracking-widest text-[11px] md:text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <PlusCircle size={18}/> Make a Complaint
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </header>

      {/* --- CAROUSEL --- */}
      <section className="mb-32 px-6">
        <div className="max-w-8xl mx-auto">
          <Swiper modules={[Pagination, Autoplay, Navigation]} spaceBetween={30} slidesPerView={1} loop={true} autoplay={{ delay: 3000 }} pagination={{ clickable: true }} navigation={true} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
            {galleryImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="h-[300px] md:h-[450px] rounded-[2.5rem] overflow-hidden border border-white/10 relative group">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-emerald-400 font-semibold uppercase text-xs tracking-widest">{img.alt}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* --- METRICS SECTION --- */}
      <section className="px-6 mb-40 font-semibold">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 uppercase tracking-tighter text-white">Accountability You Can Measure</h2>
          <p className="text-gray-500 text-[10px] mb-16 font-semibold tracking-widest uppercase text-center">Real metrics from real resolutions. No hidden data, no empty promises.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16">
            {[
              { label: "Active users & growing", value: "15000+" },
              { label: "Resolution rate in 2026", value: "92%" },
              { label: "Average response time", value: "2.4 Days" },
              { label: "Transparency", value: "100%" }
            ].map((s, i) => (
              <div key={i} className="bg-[#0a1a14] border border-white/5 p-6 md:p-10 rounded-2xl h-44 md:h-52 flex flex-col justify-center transition-all hover:border-emerald-500/30">
                <div className="text-2xl md:text-3xl font-semibold text-white mb-2">{s.value}</div>
                <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-emerald-500 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- READY TO MAKE A DIFFERENCE SECTION --- */}
      <section className="max-w-6xl mx-auto w-full px-8 mb-40 flex flex-col md:flex-row gap-16 md:gap-20 font-semibold">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-semibold leading-tight mb-6 uppercase tracking-tighter">Ready to Make a Difference?</h2>
          <p className="text-gray-400 text-lg font-semibold mb-10 max-w-md mx-auto md:mx-0">Join thousands of citizens who are actively shaping their communities. Your voice matters.</p>
          <button onClick={() => navigate("/signup")} className="bg-[#00381d] hover:bg-[#00592E] text-white px-8 md:px-10 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 border border-emerald-900/50 uppercase tracking-widest transition-all mx-auto md:mx-0 w-full md:w-auto">
            Get Started Free <ArrowRight size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <FeatureCard title="Pin Your Issue" desc="Use GPS or search to mark the exact location." icon={<MapPin size={20} className="text-emerald-500" />} />
          <FeatureCard title="Track Progress" desc="Watch your report move through stages." icon={<Clock size={20} className="text-emerald-500" />} />
          <FeatureCard title="Share Ideas" desc="Suggest improvements and vote on proposals." icon={<Lightbulb size={20} className="text-emerald-500" />} />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#020705] border-t border-white/5 py-16 md:py-20 px-8 mt-auto text-gray-600 font-semibold">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold text-white mb-4 uppercase tracking-widest text-center md:text-left">CIVICLENS</h3>
            <p className="text-[10px] font-semibold leading-relaxed text-center md:text-left">Transparent civic engagement for a better community.</p>
          </div>
          <div><h4 className="text-[10px] font-semibold text-white mb-6 uppercase tracking-widest">Platform</h4><ul className="text-[10px] space-y-3 uppercase tracking-tighter font-semibold"><li className="hover:text-emerald-400 transition-colors cursor-pointer">Impact Map</li><li className="hover:text-emerald-400 transition-colors cursor-pointer">Report Issue</li></ul></div>
          <div><h4 className="text-[10px] font-semibold text-white mb-6 uppercase tracking-widest">Resources</h4><ul className="text-[10px] space-y-3 uppercase tracking-tighter font-semibold"><li className="hover:text-emerald-400 transition-colors cursor-pointer">About us</li><li className="hover:text-emerald-400 transition-colors cursor-pointer">Help Center</li></ul></div>
          <div><h4 className="text-[10px] font-semibold text-white mb-6 uppercase tracking-widest">Legal</h4><ul className="text-[10px] space-y-3 uppercase tracking-tighter font-semibold"><li className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy</li><li className="hover:text-emerald-400 transition-colors cursor-pointer">Terms</li></ul></div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }) => (
  <div className="bg-gradient-to-r from-[#0a1a14] to-transparent p-6 md:p-8 rounded-2xl border-l-4 border-emerald-800 hover:translate-x-2 transition-transform duration-300 font-semibold">
    <div className="flex gap-4 md:gap-6 items-start">
      <div className="p-3 bg-emerald-950 rounded-xl border border-emerald-800/50">{icon}</div>
      <div>
        <h4 className="font-semibold text-lg md:text-xl mb-1 md:mb-2 uppercase tracking-tighter text-white">{title}</h4>
        <p className="text-[9px] md:text-[10px] text-gray-500 font-semibold uppercase tracking-widest leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

export default CivicLensLanding;