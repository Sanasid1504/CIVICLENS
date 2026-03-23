import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, HelpCircle, ShieldCheck, 
  MapPin, Camera, CheckCircle2, MessageSquare, 
  Navigation, UserCheck 
} from 'lucide-react';

const HelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050d0a] text-white font-sans no-scrollbar overflow-x-hidden">
      
      {/* --- BACKGROUND BLUR --- */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-emerald-900/10 blur-[150px] rounded-full" />
      </div>

      {/* --- HEADER --- */}
      <nav className="p-8 max-w-7xl mx-auto flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-all uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-xl font-bold tracking-[0.2em] uppercase">CivicLens <span className="text-emerald-500">Support</span></h1>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        
        {/* --- MISSION SECTION (ABOUT) --- */}
        <section className="mb-24">
          <div className="bg-gradient-to-br from-[#08100d] to-[#050d0a] border border-white/5 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-sm font-black text-emerald-500 uppercase tracking-[0.4em] mb-6">Our Mission</h2>
              <p className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight mb-8">
                Building a bridge between <span className="text-emerald-400 italic">Citizens</span> and <span className="opacity-50 text-white">Authorities</span> through radical transparency.
              </p>
              <p className="text-gray-500 text-lg leading-relaxed">
                CivicLens isn't just a reporting tool; it’s an accountability engine. We use real-time data and audit trails to ensure that every street light, every pothole, and every water leak is handled by the right department with a recorded resolution.
              </p>
            </div>
            <ShieldCheck size={300} className="absolute right-[-50px] bottom-[-50px] text-white/5 -rotate-12" />
          </div>
        </section>

        {/* --- STEP-BY-STEP COMPLAINT GUIDE --- */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">The Workflow</h2>
              <h3 className="text-5xl font-bold tracking-tight">Filing a Report</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StepCard 
              number="01" 
              icon={<UserCheck className="text-emerald-500" />} 
              title="Identity" 
              desc="Enter your name in the form. This allows authorities to reach out for clarification and awards you 'Civic Points'."
            />
            <StepCard 
              number="02" 
              icon={<Navigation className="text-emerald-500" />} 
              title="Category" 
              desc="Choose the issue type. Selecting 'Water Issues' or 'Roads' ensures the correct department is notified instantly."
            />
            <StepCard 
              number="03" 
              icon={<Camera className="text-emerald-500" />} 
              title="Evidence" 
              desc="Pin the location and upload a photo. This is the most crucial part—officers need clear visual proof to dispatch a team."
            />
            <StepCard 
              number="04" 
              icon={<CheckCircle2 className="text-emerald-500" />} 
              title="Track" 
              desc="Once submitted, monitor your dashboard. You'll see the status move to 'In Progress' as soon as an officer approves it."
            />
          </div>
        </section>

        {/* --- FAQ / CONTACT --- */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-[#08100d] border border-white/5 rounded-[3rem] p-12">
            <h3 className="text-2xl font-bold mb-8">Common Questions</h3>
            <div className="space-y-8">
              <Question q="How long does a resolution take?" a="The city average is currently 4.2 days. Urgent issues like water bursts are prioritised." />
              <Question q="What are Civic Points?" a="Points earned for valid reports. High-ranking citizens get priority attention on future reports." />
              <Question q="Is my data public?" a="Your report and photos are public, but your personal contact info is only visible to the authorities." />
            </div>
          </div>

          <div className="bg-emerald-600 rounded-[3rem] p-12 flex flex-col justify-between shadow-xl shadow-emerald-900/20">
            <div>
              <MessageSquare size={40} className="mb-6" />
              <h3 className="text-2xl font-bold mb-4 leading-tight">Still need assistance?</h3>
              <p className="text-emerald-100/70 text-sm">Our technical support team is available to help with account or submission issues.</p>
            </div>
            <button className="w-full bg-white text-emerald-900 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-emerald-50 transition-all mt-8">
              Contact Support
            </button>
          </div>
        </section>
      </main>

      <footer className="p-12 text-center text-gray-700 text-[10px] font-bold uppercase tracking-[0.3em] border-t border-white/5">
        &copy; 2026 CivicLens. All Rights Reserved.
      </footer>
    </div>
  );
};

const StepCard = ({ number, icon, title, desc }) => (
  <div className="bg-[#08100d] border border-white/5 p-10 rounded-[2.5rem] hover:border-emerald-500/30 transition-all group relative overflow-hidden">
    <div className="absolute top-[-10px] right-[-10px] text-[100px] font-black text-white/5 group-hover:text-emerald-500/10 transition-colors">{number}</div>
    <div className="bg-emerald-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 relative z-10">
      {icon}
    </div>
    <h4 className="text-xl font-bold mb-4 relative z-10">{title}</h4>
    <p className="text-gray-500 text-sm leading-relaxed relative z-10">{desc}</p>
  </div>
);

const Question = ({ q, a }) => (
  <div className="space-y-2 border-l-2 border-emerald-500/30 pl-6 hover:border-emerald-500 transition-all">
    <h4 className="font-bold text-white">{q}</h4>
    <p className="text-gray-500 text-sm">{a}</p>
  </div>
);

export default HelpPage;