import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, Clock, ArrowLeft, Award, Zap, MapPin, ChevronRight, Activity, FileText } from 'lucide-react';
import Apiclient from '../api/Api';
import { Slab } from 'react-loading-indicators';

const UserAnalytics = () => {
  const navigate = useNavigate();
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("Token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userRes = await Apiclient.get("/user/me", {
          headers: { Authorization: token }
        });
        setUser(userRes.data);

        const reportRes = await Apiclient.get("/civilian/complaints", {
          headers: { Authorization: token }
        });
        setReports(reportRes.data);

      } catch (err) {
        localStorage.clear();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const myReports = useMemo(() => reports || [], [reports]);

  const resolvedCount = myReports.filter(
    r => r.status?.toLowerCase() === 'resolved'
  ).length;

  const inProgressCount = myReports.filter(
    r => r.status?.toLowerCase() === 'submitted'
  ).length;

  const civicPoints = (user?.points || 0) * 5;
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        <Slab color="#006e39" size="medium" text="" textColor="" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#050d0a] text-gray-200 font-sans selection:bg-emerald-500/30 no-scrollbar overflow-x-hidden">

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

        <div className="flex flex-col gap-3 justify-between items-start">
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tighter">
              Welcome, {user?.name || 'User'}
            </h2>
            <p className="text-gray-500 mt-1">Track your community contributions and rewards</p>
          </div>
          <div className="bg-[#08100d] border border-white/5 p-6 rounded-3xl min-w-[280px]">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
              <span>Rank: Silver</span>
              <span>{civicPoints} / 1000 XP</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(civicPoints / 1000) * 100}%` }} />
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox icon={<FileText size={20} className="text-blue-400" />} label="Total Reports" value={myReports.length} />
          <StatBox icon={<Zap size={20} className="text-yellow-500" />} label="Civic Points" value={civicPoints} />
          <StatBox icon={<Activity size={20} className="text-orange-500" />} label="In Progress" value={inProgressCount} />
          <StatBox icon={<CheckCircle2 size={20} className="text-emerald-500" />} label="Resolved" value={resolvedCount} />
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Recent Activity</h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {myReports.length > 0 ? myReports.map((report, idx) => (
            <div
              onClick={() => {
                setSelectedReportId(report.id);
                setIsModalOpen(true);
              }}
              className="bg-[#08100d] border border-white/5 rounded-[2rem] p-8 flex items-center justify-between group hover:border-emerald-500/30 transition-all shadow-xl cursor-pointer"
            >
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                  <img src={report.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Evidence" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${report.status?.toLowerCase() === 'submitted'
                      ? 'bg-blue-900/30 text-blue-400'
                      : 'bg-emerald-900/30 text-emerald-400'
                      }`}>
                      {report.status}
                    </span>
                    <span className="text-[10px] font-mono text-gray-700">
                      #{report.id?.toString().slice(-6)}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-tight">{report.title}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-2 uppercase font-bold tracking-widest mt-2">
                    <MapPin size={14} className="text-emerald-500" />
                    {report.latitude?.toFixed(3)}, {report.longitude?.toFixed(3)}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-800 group-hover:text-emerald-500" />
            </div>

          )) : (
            <div className="py-24 text-center bg-[#08100d]/50 border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-gray-700 uppercase font-black tracking-[0.5em] text-[10px]">
                No reports found. Start making an impact!
              </p>
            </div>
          )}
        </section>
        <ComplaintDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          id={selectedReportId}
        />
      </main>
    </div>
  );
};

const StatBox = ({ icon, label, value }) => (
  <div className="bg-[#08100d] border border-white/5 p-8 rounded-[2rem] flex justify-between items-center group shadow-lg">
    <div>
      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-4xl font-bold text-white tracking-tighter">{value}</h4>
    </div>
    <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110">
      {icon}
    </div>
  </div>
);

const ComplaintDetailModal = ({ isOpen, onClose, id }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !id) return;

    const fetchDetail = async () => {
      setLoading(true);
      const token = localStorage.getItem("Token");

      try {
        const res = await Apiclient.get(`/civilian/complaints/${id}`, {
          headers: { Authorization: token }
        });

        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#08100d] w-full max-w-2xl rounded-[2rem] border border-white/10 shadow-2xl text-white">

        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-black uppercase tracking-widest">
            Complaint Details
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : data ? (
            <>
              <img
                src={data.image_url}
                className="w-full h-48 object-cover rounded-xl"
              />

              <h3 className="text-xl font-bold">{data.title}</h3>

              <p className="text-gray-400 text-sm">{data.description}</p>

              <div className="text-xs uppercase tracking-widest text-gray-500">
                Status: {data.status}
              </div>

              <div className="mt-4">
                <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Actions Timeline
                </h4>

                {data.actions?.length > 0 ? (
                  data.actions.map((a, i) => (
                    <div key={i} className="border border-white/5 rounded-xl p-4 mb-2">
                      <p className="text-sm font-bold">{a.action}</p>
                      <p className="text-xs text-gray-400">{a.comment}</p>
                      <p className="text-[10px] text-gray-600 mt-1">
                        {new Date(a.time).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-xs">No actions yet</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-red-400">Failed to load</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;