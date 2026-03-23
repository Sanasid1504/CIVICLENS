import React, { useState } from 'react';
import { useReports } from '../../context/ReportContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, Filter, FileText, Clock, 
  RotateCcw, CheckCircle, MapPin, Calendar, Award 
} from 'lucide-react';

const Userdash = () => {
  const { reports } = useReports();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // 1. Filter reports to show only what the current user posted
  const myReports = reports.filter(r => r.userEmail === user?.email);

  // 2. Points Logic: 10 points for reporting, 50 points when Resolved
  const calculatePoints = () => {
    const reportPoints = myReports.length * 10;
    const resolvedBonus = myReports.filter(r => r.status === 'RESOLVED').length * 50;
    return reportPoints + resolvedBonus;
  };

  const stats = [
    { label: 'My Total Reports', value: myReports.length, icon: <FileText size={20} />, color: 'bg-gray-100 text-gray-500' },
    { label: 'Civic Points', value: calculatePoints(), icon: <Award size={20} />, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'In Progress', value: myReports.filter(r => r.status === 'IN PROGRESS').length, icon: <RotateCcw size={20} />, color: 'bg-blue-100 text-blue-500' },
    { label: 'Resolved', value: myReports.filter(r => r.status === 'RESOLVED').length, icon: <CheckCircle size={20} />, color: 'bg-green-100 text-green-500' },
  ];

  const filteredReports = myReports.filter(r => {
    const titleMatch = r.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = r.desc?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || descMatch;
    const matchesStatus = statusFilter === 'All Status' || r.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f8faff] p-8 font-sans text-slate-700">
      {/* --- HEADER --- */}
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, {user?.name || 'Sana'}</h1>
          <p className="text-slate-500">Track your community contributions and rewards</p>
        </div>
        
        {/* Progress Tracker */}
        <div className="w-full md:w-80 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                <span>Citizen Rank: Silver</span>
                <span>{calculatePoints()} / 1000 XP</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min((calculatePoints() / 1000) * 100, 100)}%` }}
                ></div>
            </div>
        </div>
      </header>

      {/* --- STATS GRID --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center group hover:border-emerald-200 transition-all">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
            </div>
            <div className={`p-4 rounded-2xl ${stat.color} bg-opacity-40 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Search your reported issues..." 
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-4 border border-slate-200 rounded-2xl">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="bg-transparent outline-none text-sm font-bold text-slate-600 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {/* --- USER CONTENT FEED --- */}
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Recent Activity</h2>
        
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div key={report.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          report.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 
                          report.status === 'IN PROGRESS' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                            {report.status}
                        </span>
                        <span className="px-4 py-1.5 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {report.type}
                        </span>
                    </div>
                    {report.status === 'RESOLVED' && (
                      <div className="flex items-center gap-2 text-emerald-500">
                        <Award size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">+50 XP Earned</span>
                      </div>
                    )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{report.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{report.desc}</p>
                
                <div className="flex flex-wrap items-center gap-8 text-slate-400 text-[11px] font-bold uppercase tracking-wider pt-6 border-t border-slate-50">
                    <span className="flex items-center gap-2"><MapPin size={14} className="text-emerald-500"/> {report.location}</span>
                    <span className="flex items-center gap-2"><Calendar size={14}/> {report.date || 'Feb 21, 2026'}</span>
                </div>
            </div>
          ))
        ) : (
          <div className="bg-white py-24 rounded-[4rem] border border-dashed border-slate-200 text-center">
            <p className="text-slate-400 italic font-medium">No reports found. Start making an impact!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Userdash;