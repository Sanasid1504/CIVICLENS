import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../../context/ReportContext';
import { useAuth } from '../../context/AuthContext';
import { Trophy, CheckCircle2, Clock, ArrowLeft, Award, Zap, MapPin, ChevronRight, Activity, FileText } from 'lucide-react';

const UserAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reports } = useReports();

  // --- SYNC FILTER ---
  const myReports = useMemo(() => {
    const currentName = user?.username || "Sana";
    return reports.filter(r => r.user === currentName);
  }, [reports, user]);

  const resolvedCount = myReports.filter(r => r.status === 'RESOLVED').length;
  const inProgressCount = myReports.filter(r => r.status === 'IN PROGRESS').length;
  const civicPoints = (myReports.length * 50) + (resolvedCount * 150);

  return (
    <div className="min-h-screen bg-[#050d0a] text-gray-200 font-sans selection:bg-emerald-500/30 no-scrollbar overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="p-8 max-w-10xl mx-auto flex justify-between items-center border-b border-white/5 bg-[#08100d]">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="text-right">
            <h1 className="text-xl font-bold text-white uppercase tracking-widest leading-none">User <span className="text-emerald-500">Analytics</span></h1>
            <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">Live Tracking</p>
        </div>
      </nav>

      <main className="max-w-10xl mx-auto px-8 py-10 space-y-10">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-4xl font-bold text-white tracking-tighter">Welcome, {user?.username || 'Sana'}</h2>
                <p className="text-gray-500 mt-1">Track your community contributions and rewards</p>
            </div>
            <div className="bg-[#08100d] border border-white/5 p-6 rounded-3xl min-w-[280px]">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                    <span>Rank: Silver</span>
                    <span>{civicPoints} / 1000 XP</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(civicPoints/1000)*100}%` }} />
                </div>
            </div>
        </div>

        {/* --- STATS GRID --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox icon={<FileText size={20} className="text-blue-400"/>} label="Total Reports" value={myReports.length} />
          <StatBox icon={<Zap size={20} className="text-yellow-500"/>} label="Civic Points" value={civicPoints} />
          <StatBox icon={<Activity size={20} className="text-orange-500"/>} label="In Progress" value={inProgressCount} />
          <StatBox icon={<CheckCircle2 size={20} className="text-emerald-500"/>} label="Resolved" value={resolvedCount} />
        </section>

        {/* --- ACTIVITY LIST --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Recent Activity</h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {myReports.length > 0 ? [...myReports].reverse().map((report, idx) => (
            <div key={idx} className="bg-[#08100d] border border-white/5 rounded-[2rem] p-8 flex items-center justify-between group hover:border-emerald-500/30 transition-all shadow-xl">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                  <img src={report.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Evidence" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        report.status === 'PENDING' ? 'bg-orange-900/30 text-orange-400' : 
                        report.status === 'IN PROGRESS' ? 'bg-blue-900/30 text-blue-400' : 
                        'bg-emerald-900/30 text-emerald-400'
                    }`}>
                        {report.status}
                    </span>
                    <span className="text-[10px] font-mono text-gray-700">#{report.id.slice(-6)}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-tight">{report.title}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-2 uppercase font-bold tracking-widest mt-2">
                    <MapPin size={14} className="text-emerald-500" /> {report.location}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-800 group-hover:text-emerald-500" />
            </div>
          )) : (
            <div className="py-24 text-center bg-[#08100d]/50 border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-gray-700 uppercase font-black tracking-[0.5em] text-[10px]">No reports found. Start making an impact!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const StatBox = ({ icon, label, value }) => (
  <div className="bg-[#08100d] border border-white/5 p-8 rounded-[2rem] flex justify-between items-center group shadow-lg">
    <div><p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">{label}</p><h4 className="text-4xl font-bold text-white tracking-tighter">{value}</h4></div>
    <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110">{icon}</div>
  </div>
);

export default UserAnalytics;