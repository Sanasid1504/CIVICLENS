import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../../context/ReportContext'; 
import { 
  ListChecks, LogOut, Search, MapPin, X, History, 
  MessageSquare, CheckCircle2, FastForward, Ban, Menu, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AuthorityDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { reports, updateReportStatus } = useReports(); 
  
  const [activeTab, setActiveTab] = useState('All Tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [modalMode, setModalMode] = useState(null); 
  const [statusComment, setStatusComment] = useState('');

  const [auditHistory, setAuditHistory] = useState([
    { action: 'SYSTEM', reason: 'Terminal Active.', date: '2026-03-31' }
  ]);

  const handleUpdate = (newStatus) => {
    if (!statusComment.trim()) return;
    updateReportStatus(selectedComplaint.id, newStatus);
    
    setAuditHistory([{ 
      action: newStatus, 
      reason: statusComment, 
      date: new Date().toLocaleString() 
    }, ...auditHistory]);

    setModalMode(null);
    setStatusComment('');
    setSelectedComplaint(null);
  };

  const filtered = reports.filter(c => 
    (activeTab === 'All Tasks' || c.status === activeTab.toUpperCase()) && 
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen w-full bg-[#050d0a] text-gray-300 overflow-hidden relative font-sans">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-[90] w-64 bg-[#08100d] border-r border-white/5 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white italic uppercase">CIVICLENS</h1>
            <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Authority Terminal</p>
          </div>
          <button className="lg:hidden text-white/50" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <SidebarItem icon={<ListChecks size={18}/>} label="Worklist" active={activeTab !== 'Audit History'} onClick={() => {setActiveTab('All Tasks'); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<History size={18}/>} label="History" active={activeTab === 'Audit History'} onClick={() => {setActiveTab('Audit History'); setIsSidebarOpen(false);}} />
        </nav>
        
        <div className="p-5 border-t border-white/5">
           <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center justify-center gap-2 text-red-500/80 py-2.5 rounded-lg font-bold uppercase text-[10px] border border-red-500/10 hover:bg-red-500/5 transition-all">
              <LogOut size={14} /> Logout
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-16 border-b border-white/5 bg-[#08100d]/50 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-3">
  {/* Mobile Menu Button */}
  <button className="lg:hidden p-2 text-white/70 bg-white/5 rounded-lg shrink-0" onClick={() => setIsSidebarOpen(true)}>
    <Menu size={18} />
  </button>

          <div className="relative flex-1 max-w-md"> 
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
    <input 
      type="text" 
      placeholder="Search tasks..." 
      className="w-full bg-[#0a1a14] border border-white/10 rounded-lg py-2 pl-9 text-[11px] text-white outline-none focus:border-emerald-500/20 transition-all" 
      value={searchQuery} 
      onChange={(e) => setSearchQuery(e.target.value)} 
    />
  </div>
          
          <div className="flex items-center gap-2 shrink-0 ml-1">
    <div className="text-right hidden sm:block"> {/* Show name only on tablets/desktop to save space */}
      <p className="text-[15px] font-bold text-white italic leading-none">Gov Officer</p>
      <p className="text-[7px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">Public Works</p>
    </div>
    
    {/* Avatar - Always visible */}
    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-[10px] shrink-0">
      Gov
    </div>
  </div>
</header>
        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 no-scrollbar">
          {activeTab === 'Audit History' ? (
            <div className="max-w-7xl mx-auto animate-in fade-in overflow-x-auto">
               <div className="bg-[#08100d] rounded-xl border border-white/5 min-w-[600px] shadow-lg">
                <table className="w-full text-left">
                  <thead className="bg-[#0b1410] text-emerald-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                    <tr><th className="px-5 py-3">Action</th><th className="px-5 py-3">Remarks</th><th className="px-5 py-3 text-right">Date</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditHistory.map((log, i) => (
                      <tr key={i} className="hover:bg-white/[0.01]">
                        <td className="px-5 py-3 text-xs font-bold text-white uppercase italic">{log.action}</td>
                        <td className="px-5 py-3 text-gray-400 italic text-xs">"{log.reason}"</td>
                        <td className="px-5 py-3 text-right text-gray-500 text-[10px] font-bold uppercase">{log.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-4">
              {/* MOBILE TABS */}
              <div className="flex gap-4 border-b border-white/5 overflow-x-auto no-scrollbar whitespace-nowrap">
                {['All Tasks', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeTab === tab ? 'text-white' : 'text-gray-600'}`}>
                    {tab} {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500" />}
                  </button>
                ))}
              </div>

              {/* TASK LIST */}
              <div className="grid grid-cols-1 gap-3">
                {filtered.map((item, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-start sm:items-center gap-4 group active:bg-white/[0.05] transition-all cursor-pointer" onClick={() => setSelectedComplaint(item)}>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-white/5 shrink-0">
                      <img src={item.img} className="w-full h-full object-cover opacity-60" alt="Task" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1"><StatusBadge status={item.status} /></div>
                      <h3 className="text-xs sm:text-sm font-bold text-white uppercase italic tracking-tight mb-0.5 truncate">{item.title}</h3>
                      <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold uppercase tracking-widest truncate"><MapPin size={10} className="text-emerald-500/50" /> {item.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FULL SCREEN MODAL FOR DETAILS */}
        {/* DETAILS OVERLAY - Enhanced Image Visibility */}
{selectedComplaint && (
  <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 lg:p-8 animate-in zoom-in-95 duration-200">
    <div className="w-full h-full lg:max-w-5xl lg:h-[650px] bg-[#050d0a] lg:border lg:border-white/10 lg:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
      
      {/* PHOTO CONTAINER - Optimized for clarity */}
      <div className="h-[45%] lg:h-full lg:flex-1 bg-black flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-white/5">
        <button 
          onClick={() => setSelectedComplaint(null)} 
          className="absolute top-5 left-5 p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white z-20 hover:bg-emerald-600 transition-colors"
        >
          <X size={22}/>
        </button>
        
        {/* The Fix: object-contain ensures the whole photo is seen, not cropped */}
        <img 
          src={selectedComplaint.img} 
          className="w-full h-full object-contain lg:p-4 transition-opacity duration-300" 
          alt="Evidence" 
          onLoad={(e) => e.target.style.opacity = 1}
          style={{ opacity: 0 }}
        />

        {/* Ambient Glow behind photo */}
        <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
      </div>
      
      {/* DETAILS PANEL - Refined Text Size */}
      <div className="flex-1 lg:w-[400px] p-6 lg:p-10 flex flex-col justify-between bg-[#08100d] overflow-y-auto">
        <div className="space-y-6 lg:space-y-8">
          <div className="pb-4 border-b border-white/5">
            <StatusBadge status={selectedComplaint.status} />
            <h2 className="text-lg font-bold text-white uppercase italic mt-2 leading-tight">
              {selectedComplaint.title}
            </h2>
          </div>

          <DetailBlock label="Citizen Remark" value={selectedComplaint.desc} />
          <DetailBlock label="Location Data" value={selectedComplaint.location} />
          <DetailBlock label="Reported By" value={selectedComplaint.user} />
        </div>
        
        {/* ACTIONS */}
        <div className="grid grid-cols-1 gap-2 mt-8">
          {selectedComplaint.status === 'PENDING' && (
            <ActionButton icon={<FastForward size={18}/>} label="Accept Task" color="blue" onClick={() => setModalMode('PROGRESS')} />
          )}
          {selectedComplaint.status === 'IN PROGRESS' && (
            <>
              <ActionButton icon={<MessageSquare size={18}/>} label="Update Progress" color="white" onClick={() => setModalMode('PROGRESS')} />
              <ActionButton icon={<CheckCircle2 size={18}/>} label="Mark Resolved" color="emerald" onClick={() => setModalMode('RESOLVE')} />
            </>
          )}
          {(selectedComplaint.status !== 'RESOLVED' && selectedComplaint.status !== 'REJECTED') && (
            <ActionButton icon={<Ban size={18}/>} label="Reject Protocol" color="red" onClick={() => setModalMode('REJECT')} />
          )}
        </div>
      </div>
    </div>
  </div>
)}

        {/* INPUT MODAL */}
        {modalMode && (
          <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-[#08100d] border border-white/10 rounded-xl p-6 shadow-2xl">
              <h3 className="text-sm font-bold text-white uppercase italic mb-4">Official Remarks</h3>
              <textarea 
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                placeholder="Log entries..."
                className="w-full bg-[#050d0a] border border-white/10 rounded-lg p-3 text-xs text-white outline-none min-h-[100px]"
              />
              <div className="flex gap-2 mt-4">
                <button onClick={() => setModalMode(null)} className="flex-1 py-2 text-[10px] font-black uppercase text-gray-500">Cancel</button>
                <button onClick={() => handleUpdate(modalMode === 'REJECT' ? 'REJECTED' : modalMode === 'RESOLVE' ? 'RESOLVED' : 'IN PROGRESS')} disabled={!statusComment.trim()} className="flex-1 py-2 rounded-lg text-white text-[10px] font-black uppercase bg-emerald-600 disabled:opacity-20">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// HELPERS
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'text-gray-500 hover:text-gray-300'}`}>
    {icon} <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

const StatusBadge = ({ status }) => {
  const styles = {
    RESOLVED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
    'IN PROGRESS': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    PENDING: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  };
  return <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded border ${styles[status]}`}>{status}</span>;
};

const DetailBlock = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[8px] font-black text-emerald-500/50 uppercase tracking-widest">{label}</p>
    <p className="text-xs font-bold text-white uppercase italic tracking-tight">{value || "N/A"}</p>
  </div>
);

const ActionButton = ({ icon, label, color, onClick }) => {
  const theme = {
    emerald: 'bg-emerald-600 text-white',
    red: 'bg-red-500/10 text-red-500 border border-red-500/20',
    blue: 'bg-blue-600 text-white',
    white: 'bg-white/5 text-white border border-white/10'
  };
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${theme[color]}`}>
      {icon} {label}
    </button>
  );
};

export default AuthorityDashboard;