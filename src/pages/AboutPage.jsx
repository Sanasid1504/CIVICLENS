import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Globe, Eye, 
  ShieldCheck, Award, BarChart 
} from 'lucide-react';
import Apiclient from '../api/Api';

const AboutPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("Token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await Apiclient.get("/user/me", {
          headers: { Authorization: token }
        });
        setUser(res.data);
      } catch {
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleCTA = () => {
    if (loading) return;

    const token = localStorage.getItem("Token");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    const role = user.role;

    if (role === "civilian") {
      navigate("/user-stats");
    }
  };

  return (
    <div className="min-h-screen max-sm:w-88 overflow-x-hidden max-sm:absolute bg-[#050d0a] text-white font-instrument no-scrollbar ">
      
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <nav className="p-8 max-w-7xl mx-auto flex justify-between items-center relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-all uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">About the Project</span>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        
        <section className="mb-24 text-center">
          <h1 className="text-4xl sm:text-6xl md:text-14xl font-black uppercase tracking-tighter mb-8 leading-none">
            Radical <br/> <span className="text-emerald-500 italic">Transparency.</span>
          </h1>
          <p className="text-gray-400 text-xl md:text-1xl max-w-3xl mx-auto font-light leading-relaxed">
            CivicLens was born from a simple question: <br/> 
            <span className="text-white italic">"Why is it so hard to track city progress?"</span>
          </p>
        </section>

        <section className="mb-24">
          <div className="bg-[#08100d] border border-white/5 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-sm font-black text-emerald-500 uppercase tracking-[0.4em]">The Problem</h2>
                <h3 className="text-3xl sm:text-4xl font-bold leading-tight">Disconnected Cities, <br/> Ignored Voices.</h3>
                <p className="text-gray-500 leading-relaxed text-lg">
                  Traditional civic reporting is often a "black hole"—you file a complaint and never hear back. CivicLens changes the narrative by giving every citizen a lens into the government's workflow.
                </p>
                <div className="flex gap-4 pt-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <Eye className="text-emerald-500 mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Visibility</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <ShieldCheck className="text-emerald-500 mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Trust</p>
                    </div>
                </div>
              </div>
              <div className="bg-[#050d0a] rounded-[3rem] p-8 border border-white/5 shadow-inner">
                <h4 className="text-emerald-500 font-black uppercase text-xs tracking-widest mb-4">Our Impact</h4>
                <p className="text-white text-3xl font-bold mb-2">92%</p>
                <p className="text-gray-500 text-sm mb-6">Of users reported feeling more connected to their local authorities after their first resolution.</p>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-24">
            <ValueCard icon={<Globe size={32} />} title="Hyper-Local" desc="We focus on neighborhoods, not just cities. Change starts at your doorstep." />
            <ValueCard icon={<BarChart size={32} />} title="Data Driven" desc="We use analytics to show authorities exactly where the city is hurting most." />
            <ValueCard icon={<Award size={32} />} title="Citizen First" desc="Your points and rank reflect your contribution to a better community." />
        </section>

        <section className="text-center bg-[#00592E] rounded-[4rem] max-sm:h-150 p-20 shadow-2xl shadow-emerald-900/20">
            <Users size={64} className="mx-auto mb-8 text-white/80" />
            <h3 className="text-xl sm:text-4xl  font-bold mb-6">Become part of the solution.</h3>
            <p className="text-emerald-100/70 mb-10 max-w-xl mx-auto font-normal">
                Join the 15,000+ citizens who are actively shaping the future of their urban environments.
            </p>
            <button 
                onClick={handleCTA}
                className="bg-white text-emerald-900 sm:px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl"
            >
                Join the Movement
            </button>
        </section>

      </main>

      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">CivicLens &copy; 2026</p>
      </footer>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }) => (
  <div className="bg-[#08100d] border border-white/5 p-10 rounded-[3rem] hover:border-emerald-500/30 transition-all group">
    <div className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <h4 className="text-xl font-bold mb-4">{title}</h4>
    <p className="text-gray-500 text-sm leading-relaxed font-normal">{desc}</p>
  </div>
);

export default AboutPage;