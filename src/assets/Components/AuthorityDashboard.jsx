import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../../context/ReportContext'; 
import { 
  ListChecks, BarChart3, LogOut, Search, Bell, 
  MapPin, Clock, CheckCircle2, MessageSquare, X, History,
  TrendingUp, AlertCircle 
} from 'lucide-react';

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const { reports, updateReportStatus } = useReports(); 
  
  const [activeTab, setActiveTab] = useState('All Tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [auditModal, setAuditModal] = useState({ isOpen: false, type: '', reason: '' });
  
  const [auditHistory, setAuditHistory] = useState([
    { id: 'CL-20001', action: 'Approved', reason: 'Verified by officer.', date: '2026-03-15' }
  ]);

  // --- ANALYTICS LOGIC ---
  const analytics = useMemo(() => {
    const unsolved = reports.filter(r => r.status !== 'RESOLVED');
    const locationStats = {};
    
    unsolved.forEach(r => {
      locationStats[r.location] = (locationStats[r.location] || 0) + 1;
    });

    return Object.entries(locationStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [reports]);

  const totalUnsolved = reports.filter(r => r.status !== 'RESOLVED').length;

  // --- HANDLERS ---
  const submitAuditAction = () => {
    if (!auditModal.reason.trim()) return alert("Reason required.");
    const newStatus = auditModal.type === 'Approve' ? 'IN PROGRESS' : 'REJECTED';
    
    updateReportStatus(selectedComplaint.id, newStatus);
    
    const newLog = { 
      id: selectedComplaint.id, 
      action: auditModal.type === 'Approve' ? 'Approved' : 'Rejected', 
      reason: auditModal.reason, 
      date: new Date().toISOString().split('T')[0] 
    };
    
    setAuditHistory([newLog, ...auditHistory]);
    setAuditModal({ isOpen: false, type: '', reason: '' });
    setSelectedComplaint(null);
  };

  const filtered = reports.filter(c => 
    (activeTab === 'All Tasks' || c.status === activeTab.toUpperCase()) && 
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen w-full bg-[#050d0a] text-gray-200 overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#08100d] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8 pb-4">
          <h1 className="text-xl font-bold tracking-widest text-white uppercase">CIVICLENS</h1>
          <p className="text-[10px] text-emerald-500 font-bold opacity-70 uppercase tracking-tighter">Authority Dahsboard</p>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarItem 
            icon={<ListChecks size={20}/>} 
            label="Assigned Tasks" 
            active={activeTab !== 'Audit History' && activeTab !== 'Analytics'} 
            onClick={() => setActiveTab('All Tasks')} 
          />
          <SidebarItem 
            icon={<BarChart3 size={20}/>} 
            label="Analytics" 
            active={activeTab === 'Analytics'} 
            onClick={() => setActiveTab('Analytics')} 
          />
          <SidebarItem 
            icon={<History size={20}/>} 
            label="Audit History" 
            active={activeTab === 'Audit History'} 
            onClick={() => setActiveTab('Audit History')} 
          />
        </nav>

        {/* --- LIVE PERFORMANCE CARD --- */}
        <div className="m-4 p-6 bg-[#0a1a14] rounded-[2rem] border border-white/5 space-y-5">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">Live Performance</p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold text-white">4.2 Days</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">↓12%</span>
            </div>
            <p className="text-[9px] text-gray-600 uppercase font-bold mt-1">Avg. Resolution</p>
          </div>
          <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 text-red-400 font-bold uppercase text-[10px] tracking-widest py-3 bg-red-900/10 rounded-xl hover:bg-red-900/20 transition-all active:scale-95">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 bg-[#08100d]/50 backdrop-blur-md px-10 flex items-center justify-between">
          <div className="relative w-full max-w-3xl"> 
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search Ticket ID, Address, or Category..." 
              className="w-full bg-[#0a1a14] border border-white/5 rounded-2xl py-3 pl-12 text-sm text-white outline-none focus:ring-1 ring-emerald-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <Bell size={20} className="text-gray-400" />
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="text-right"><p className="text-sm font-bold">Mr. Joshi</p><p className="text-[10px] text-gray-500 uppercase font-bold">Public Works</p></div>
              <img src="https://i.pravatar.cc/150?u=joshi" className="w-10 h-10 rounded-xl border border-emerald-500/30 object-cover" alt="Admin" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
          
          {/* --- ANALYTICS VIEW --- */}
          {activeTab === 'Analytics' ? (
            <div className="max-w-[1400px] mx-auto space-y-10">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-5xl font-bold tracking-tight text-white mb-2">Issue Hotspots</h2>
                  <p className="text-gray-500">Geographical distribution of unresolved citizen reports.</p>
                </div>
                <div className="bg-emerald-950/30 border border-emerald-500/20 p-6 rounded-3xl text-right">
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Total Backlog</p>
                  <p className="text-4xl font-bold text-white">{totalUnsolved}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-[#08100d] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <TrendingUp className="text-emerald-500" size={24} />
                    <h3 className="text-lg font-bold uppercase tracking-widest">Top Locations</h3>
                  </div>
                  <div className="space-y-8">
                    {analytics.map((loc, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                          <span className="text-gray-300">{loc.name}</span>
                          <span className="text-emerald-500">{loc.count} Pending</span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${(loc.count / totalUnsolved) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0a1a14] border border-emerald-500/10 p-10 rounded-[2.5rem] flex flex-col justify-center text-center">
                  <AlertCircle size={48} className="text-emerald-500 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-white mb-4">Priority Area</h3>
                  <p className="text-3xl font-black text-emerald-500 uppercase tracking-tighter mb-2">{analytics[0]?.name || "None"}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">This area currently holds the highest density of unresolved issues.</p>
                </div>
              </div>
            </div>
          ) : activeTab === 'Audit History' ? (
             <div className="max-w-[1400px] mx-auto">
               <h2 className="text-3xl font-bold mb-6 tracking-tight text-white">System Audit Trail</h2>
               <div className="bg-[#08100d] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                 <table className="w-full text-left">
                   <thead className="bg-[#0b1410] text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                     <tr><th className="px-10 py-6">ID</th><th className="px-10 py-6">Action</th><th className="px-10 py-6">Reason</th><th className="px-10 py-6 text-right">Date</th></tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {auditHistory.map((log, i) => (<tr key={i} className="hover:bg-white/5"><td className="px-10 py-6 font-mono text-sm">{log.id}</td><td className="px-10 py-6"><span className="px-3 py-1 bg-emerald-900/40 text-emerald-400 rounded-full text-[9px] font-bold uppercase">{log.action}</span></td><td className="px-10 py-6 text-gray-400 italic text-sm">"{log.reason}"</td><td className="px-10 py-6 text-right text-gray-500 text-xs">{log.date}</td></tr>))}
                   </tbody>
                 </table>
               </div>
             </div>
          ) : (
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-3">Assigned Tasks</h2>
                <p className="text-gray-500  text-md">Real-time resolution management for citizen requests.</p>
              </div>
              <div className="flex gap-12 border-b border-white/5 mb-8">
                {['All Tasks', 'Pending', 'In Progress', 'Resolved'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-5 text-sm font-black uppercase tracking-widest relative ${activeTab === tab ? 'text-emerald-500' : 'text-gray-500 hover:text-white'}`}>
                    {tab} {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full" />}
                  </button>
                ))}
              </div>
              <div className="space-y-6">
                {filtered.map((item, i) => (
                  <div key={i} className="bg-[#08100d] border border-white/5 rounded-[1rem] p-10 flex items-center gap-10 hover:border-emerald-500/40 transition-all shadow-2xl">
                    <div className="w-60 h-44 rounded-[1rem] overflow-hidden border border-white/10 shrink-0">
                      <img src={item.img} className="w-full h-full object-cover" alt="Issue" onError={(e) => e.target.src = "/pothole.jpeg"} />
                    </div>
                    <div className="flex-1 space-y-5 pr-12">
                      <div className="flex gap-4 items-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${item.status === 'PENDING' ? 'bg-orange-900/40 text-orange-400' : item.status === 'IN PROGRESS' ? 'bg-cyan-900/40 text-cyan-400' : 'bg-emerald-900/40 text-emerald-400'}`}>{item.status}</span>
                        <span className="text-[10px] font-mono text-gray-700">#{item.id}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">{item.title}</h3>
                      <div className="flex gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> {item.location}</span>
                        <span className="flex items-center gap-2"><Clock size={16} /> {item.time || 'Recently'}</span>
                      </div>
                    </div>
                    <button onClick={() => setSelectedComplaint(item)} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[12px] tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95">View Details</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- DETAIL OVERLAY --- */}
        {selectedComplaint && (
          <div className="absolute inset-0 z-40 bg-[#050d0a] p-12 overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
              <h1 className="text-4xl font-black uppercase tracking-widest italic text-white">Ticket: {selectedComplaint.id}</h1>
              <button onClick={() => setSelectedComplaint(null)} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X size={32} className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-12 gap-16 max-w-[1500px] mx-auto w-full">
              <div className="col-span-7 rounded-[4rem] overflow-hidden border-4 border-white/5 shadow-2xl">
                <img src={selectedComplaint.img} className="w-full h-full max-h-[700px] object-cover" alt="Issue Evidence" onError={(e) => e.target.src = "/pothole.jpeg"} />
              </div>
              <div className="col-span-5 space-y-12 bg-[#08100d] p-12 rounded-[5rem] border border-white/5 shadow-inner">
                <DetailItem title="Reporting Citizen" value={selectedComplaint.user} />
                <DetailItem title="Category" value={selectedComplaint.title} />
                <DetailItem title="Description" value={selectedComplaint.desc} />
                <DetailItem title="Geo Tagged Location" value={selectedComplaint.location} isLocation />
                <div className="pt-10 border-t border-white/5">
                  {selectedComplaint.status === 'PENDING' ? (
                    <button onClick={() => setAuditModal({ isOpen: true, type: 'Approve', reason: '' })} className="w-full bg-emerald-600 py-6 rounded-[2rem] font-black text-white text-xs uppercase shadow-xl hover:bg-emerald-500 transition-all">Approve & Dispatch</button>
                  ) : selectedComplaint.status === 'IN PROGRESS' ? (
                    <button 
                      onClick={() => {
                        updateReportStatus(selectedComplaint.id, 'RESOLVED');
                        setAuditHistory([{ id: selectedComplaint.id, action: 'Resolved', reason: 'Fixed by team.', date: '2026-03-16' }, ...auditHistory]);
                        setSelectedComplaint(null);
                        alert("Ticket Resolved!");
                      }} 
                      className="w-full bg-cyan-600/10 border border-cyan-600/30 py-6 rounded-[2rem] font-black text-cyan-400 text-xs uppercase hover:bg-cyan-600 hover:text-white transition-all shadow-xl"
                    >
                      <CheckCircle2 size={18} className="inline mr-2" /> Mark as Resolved
                    </button>
                  ) : (
                    <div className="text-center p-8 bg-emerald-900/10 rounded-[2.5rem] border border-emerald-500/10 text-emerald-500 font-black uppercase text-[12px] tracking-widest">Resolution Completed</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- AUDIT MODAL --- */}
        {auditModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
            <div className="bg-[#08100d] w-full max-w-xl p-14 rounded-[4rem] border border-emerald-500/20 shadow-2xl">
              <h2 className="text-2xl font-black uppercase text-emerald-400 text-center mb-10">Officer Action Required</h2>
              <textarea className="w-full bg-[#050d0a] border border-white/5 rounded-[2rem] p-8 text-white text-base h-48 resize-none outline-none focus:ring-1 ring-emerald-500/50 mb-10 shadow-inner" placeholder="State reason..." value={auditModal.reason} onChange={(e) => setAuditModal({ ...auditModal, reason: e.target.value })} />
              <div className="flex gap-6"><button onClick={() => setAuditModal({ isOpen: false, type: '', reason: '' })} className="flex-1 font-bold text-xs text-gray-600 uppercase hover:text-gray-300">Cancel</button><button onClick={submitAuditAction} className="flex-[2] bg-emerald-600 py-5 rounded-2xl font-black text-white text-[11px] uppercase hover:bg-emerald-500 shadow-lg transition-all">Submit Action</button></div>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}} />
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    {icon} <span className="text-sm font-bold tracking-tight">{label}</span>
  </button>
);

const DetailItem = ({ title, value, isLocation }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase font-black text-emerald-500 tracking-[0.3em] opacity-70">{title}</label>
    <p className="text-white font-medium text-xl leading-relaxed flex items-center gap-3">{isLocation && <MapPin size={22} className="text-red-500" />} {value || "N/A"}</p>
  </div>
);

export default AuthorityDashboard;