
import React, { useState, useEffect } from 'react';
import { locations } from '../utilities/polygon';
import { useNavigate } from 'react-router-dom';
import { Slab } from 'react-loading-indicators';
import {
    LayoutDashboard, Users, Map, AlertTriangle, BarChart3, FileClock,
    LogOut, UserPlus, Trash2, CheckCircle2, Shield,ShieldCheck 
} from 'lucide-react';
import { Menu } from 'lucide-react';


// --- CONSTANTS ---
const DEPARTMENTS = ['Infrastructure', 'Public Safety', 'Environment', 'Healthcare', 'Transport', 'Education'];


const EMPTY_FORM = {
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    level: 'Municipal',
    jurisdictions: [],
    role: 'Government Authority',
};

// --- SUB-COMPONENTS ---
const NavItem = ({ icon, label, active, onClick, badge }) => (
    <div
        onClick={() => onClick(label)}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all group relative overflow-hidden
            ${active ? 'text-white shadow-xl shadow-emerald-900/50 bg-[#00592E]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
        {active && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />}
        <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
        <span className="text-sm font-bold tracking-wide flex-1">{label}</span>
        {badge > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
                {badge}
            </span>
        )}
    </div>
);

const PerformanceBar = ({ value }) => {
    const color = value >= 90 ? 'bg-emerald-500' : value >= 70 ? 'bg-blue-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="flex items-center gap-3">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
            </div>
            <span className="text-sm font-bold text-white">{value}%</span>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        Active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        'Pending Review': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        Inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider ${styles[status] || styles.Inactive}`}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 align-middle" />
            {status}
        </span>
    );
};

// --- MAIN COMPONENT ---
const AdminDashboard = () => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [reports, setReports] = useState([]);
    // --- STATE INITIALIZATION ---
    const [authorities, setAuthorities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("Token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const userRes = await fetch("https://168.144.68.244.sslip.io/user/me", {
                    headers: { Authorization: token }
                });

                const userData = await userRes.json();

                if (userData.role !== "Admin") {
                    navigate("/");
                    return;
                }

                setUser(userData);

                const res = await fetch("https://168.144.68.244.sslip.io/admin/users", {
                    headers: { Authorization: token }
                });

                const data = await res.json();

                const mapped = data.map((a) => {
                    let matchedArea = null;

                    if (a.jurisdiction) {
                        matchedArea = locations.find(loc =>
                            JSON.stringify(loc.polygon) === JSON.stringify(a.jurisdiction)
                        );
                    }
                    console.log(a)
                    return {
                        id: a.id,
                        name: a.name,
                        email: a.email,
                        department: matchedArea ? matchedArea.area : "Unassigned",
                        performance: Math.min(100, Math.round((a.points || 0))),
                        status: a.is_suspended ? "Inactive" : "Active"
                    };
                });
                const reportRes = await fetch("https://168.144.68.244.sslip.io/admin/reports", {
                    headers: { Authorization: token }
                });

                const reportData = await reportRes.json();
                setReports(reportData);
                setAuthorities(mapped);

            } catch {
                localStorage.clear();
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);
    const [areaAssignments, setAreaAssignments] = useState({});
    const analyticsStats = [
        { label: 'Total Reports', value: reports?.length || 0 },
        { label: 'Resolved Issues', value: reports?.filter(r => r.status === 'resolved').length || 0 },
        { label: 'Pending Reports', value: reports?.filter(r => r.status === 'Submitted').length || 0 },
        { label: 'Escalations', value: 0 },
    ];
    const chartData = Object.entries(
        reports.reduce((acc, r) => {
            acc[r.category] = (acc[r.category] || 0) + 1;
            return acc;
        }, {})
    ).map(([category, count]) => ({
        category,
        count
    }));

    const max = Math.max(...chartData.map(d => d.count), 1);

    const chartBars = chartData.map(d => ({
        ...d,
        height: Math.round((d.count / max) * 100)
    }));
    const systemLogs = reports
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10)
        .map(r => ({
            type: r.status === 'resolved' ? 'resolve' : 'report',
            message:
                r.status === 'resolved'
                    ? `Resolved: ${r.title}`
                    : `Reported: ${r.title}`,
            time:new Date(r.created_at).toLocaleDateString()
        }));
    const logIcon = {
        report: '📄',
        resolve: '✅'
    };
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newAuth, setNewAuth] = useState(EMPTY_FORM);
    const [authPage, setAuthPage] = useState(1);
    const AUTH_PER_PAGE = 4;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);





    // --- HANDLERS ---

    const handleAddAuthority = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("Token");

        try {
            const res = await fetch("https://168.144.68.244.sslip.io/admin/register-authority", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify({
                    name: newAuth.name,
                    email: newAuth.email,
                    password: newAuth.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.detail || "Failed to register");
                return;
            }

            alert("Authority registered successfully");

            // 🔥 REFETCH USERS (IMPORTANT)
            const updatedRes = await fetch("https://168.144.68.244.sslip.io/admin/users", {
                headers: { Authorization: token }
            });

            const updatedData = await updatedRes.json();

            const mapped = updatedData.map((a) => {
                let matchedArea = null;

                if (a.jurisdiction) {
                    matchedArea = locations.find(loc =>
                        JSON.stringify(loc.polygon) === JSON.stringify(a.jurisdiction)
                    );
                }

                return {
                    id: a.id,
                    name: a.name,
                    email: a.email,
                    area: matchedArea ? matchedArea.area : "Unassigned",
                    performance: a.points || 0,
                    status: a.is_suspended ? "Inactive" : "Active"
                };
            });

            setAuthorities(mapped);

            setNewAuth(EMPTY_FORM);
            setIsFormOpen(false);

        } catch (err) {
            alert("Network error");
        }
    };
    const handleDeleteAuthority = async (id) => {
        const token = localStorage.getItem("Token");

        if (!window.confirm("Toggle suspension?")) return;

        try {
            await fetch(`https://168.144.68.244.sslip.io/admin/suspend-user/${id}`, {
                method: "PUT",
                headers: { Authorization: token }
            });

            setAuthorities(prev =>
                prev.map(a =>
                    a.id === id
                        ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" }
                        : a
                )
            );
        } catch {
            alert("Failed");
        }
    };



    const handleAssignJurisdiction = async (authId, email, name) => {
        const selectedAreaName = areaAssignments[email];
        if (!selectedAreaName) {
            alert("Please select a district from the dropdown.");
            return;
        }

        const matchedLocation = locations.find(loc => loc.area === selectedAreaName);

        if (!matchedLocation) {
            alert("Error: Location coordinates not found.");
            return;
        }

        try {
            const response = await fetch(`https://civiclens-backend-j6i2.onrender.com/admin/add-jurisdiction/${authId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem("Token")
                },
                body: JSON.stringify({
                    jurisdiction: matchedLocation.polygon
                })
            });

            if (response.ok) {

                alert(`Successfully assigned ${selectedAreaName} coordinates to ${name}!`);
            } else {
                const errorData = await response.json();
                alert(`Backend Error: ${errorData.detail || 'Failed to assign jurisdiction'}`);
            }
        } catch (error) {
            console.error("Failed to connect to backend:", error);
            alert("Network Error: Could not reach the server.");
        }
    };

    const totalPages = Math.ceil(authorities.length / AUTH_PER_PAGE);
    const pagedAuthorities = authorities.slice((authPage - 1) * AUTH_PER_PAGE, authPage * AUTH_PER_PAGE);

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {analyticsStats.map((stat, i) => (
                                <div key={i} className="bg-[#16221d] p-6 rounded-2xl border border-white/5 shadow-2xl hover:border-emerald-500/30 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <div className="text-4xl font-black text-white group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-[#16221d] p-8 rounded-3xl border border-white/5 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <BarChart3 className="text-emerald-500" /> Resolution Trends
                                </h3>
                                <div className="h-64 flex items-end justify-between gap-4 px-4 bg-[#0b1410] rounded-xl border border-white/5 pt-4">
                                    {chartBars.map((bar, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2">

                                            <div
                                                className="w-6 bg-emerald-500 rounded"
                                                style={{ height: `${bar.height}px` }}
                                            />

                                            <span className="text-[10px] text-gray-400">
                                                {bar.category}
                                            </span>

                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#16221d] p-8 rounded-3xl border border-white/5 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <FileClock className="text-orange-500" /> Recent Logs
                                </h3>
                                <div className="space-y-4">
                                    {systemLogs.map(log => (
                                        <div key={log.id} className="flex items-start gap-4 p-4 bg-[#0b1410] rounded-xl border border-white/5">
                                            <div className="mt-0.5">{logIcon[log.type]}</div>
                                            <div>
                                                <p className="text-sm text-gray-300">{log.message}</p>
                                                <span className="text-[10px] text-gray-500 uppercase font-bold">{log.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Manage Authorities':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-white">Government Authorities</h2>
                                <p className="text-gray-400 text-sm mt-1">Configure administrative entities and service jurisdictions.</p>
                            </div>
                            <button onClick={() => setIsFormOpen(v => !v)} className="flex items-center gap-2 bg-[#00592E] hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg">
                                <UserPlus size={16} /> New Authority
                            </button>
                        </div>
                        <div className={`grid gap-8 ${isFormOpen ? 'grid-cols-1 lg:grid-cols-[420px_1fr]' : 'grid-cols-1'}`}>
                            {isFormOpen && (
                                <form onSubmit={handleAddAuthority} className="bg-[#16221d] p-8 rounded-3xl border border-emerald-500/30 shadow-2xl h-fit space-y-5">
                                    <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><UserPlus size={16} /> Register New</h3>
                                    <input type="text" required placeholder="Authority Name" value={newAuth.name} onChange={e => setNewAuth({ ...newAuth, name: e.target.value })} className="w-full bg-[#0b1410] border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:border-emerald-500 outline-none" />
                                    <input type="email" required placeholder="Contact Email" value={newAuth.email} onChange={e => setNewAuth({ ...newAuth, email: e.target.value })} className="w-full bg-[#0b1410] border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:border-emerald-500 outline-none" />
                                    <input type="password" required placeholder="Set Password" value={newAuth.password} onChange={e => setNewAuth({ ...newAuth, password: e.target.value })} className="w-full bg-[#0b1410] border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:border-emerald-500 outline-none" />
                                    <select required value={newAuth.department} onChange={e => setNewAuth({ ...newAuth, department: e.target.value })} className="w-full bg-[#0b1410] border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:border-emerald-500 outline-none">
                                        <option value="" disabled>Select Department</option>
                                        {DEPARTMENTS.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                                    </select>
                                    <button type="submit" className="w-full py-3 bg-[#00592E] text-white rounded-xl font-bold text-xs uppercase transition-all hover:bg-emerald-500">Confirm</button>
                                </form>
                            )}
                            <div className="bg-[#16221d] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px] text-left">
                                        <thead className="bg-[#0b1410]">
                                            <tr>
                                                {['Authority', 'Performance', 'Status', 'Actions'].map(h => (
                                                    <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {pagedAuthorities.map((auth, i) => (
                                                <tr key={auth.i} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <p className="font-bold text-white text-sm">{auth.name || auth.email}</p>
                                                        <p className="text-[11px] text-gray-500">{auth.area}</p>
                                                    </td>
                                                    <td className="px-6 py-5"><PerformanceBar value={auth.performance} /></td>
                                                    <td className="px-6 py-5"><StatusBadge status={auth.status} /></td>
                                                    <td className="px-6 py-5">
                                                        <button onClick={() => handleDeleteAuthority(auth.id)} className="text-gray-500 hover:text-red-400 transition-colors">{auth.status==="Active"?<Trash2 size={15} />:<><ShieldCheck size={15}/></>}</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Assign Areas':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-[#16221d] p-6 rounded-2xl border border-white/5 shadow-lg">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Zone Assignments</h2>
                                <p className="text-gray-400 text-sm mt-1">Bind map polygons to authority accounts.</p>
                            </div>
                        </div>
                        {authorities.map((auth) => (
                            <div key={auth.id} className="bg-[#16221d] p-6 rounded-2xl border border-white/5 flex gap-5 items-center justify-between hover:border-emerald-500/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="text-xl">{'🏛️'}</div>
                                    <div>
                                        <h3 className="font-bold text-white">{auth.name || auth.email}</h3>
                                        <p className="text-xs text-gray-500 mt-1">ID: {auth.id || 'Pending DB Sync'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-3 w-full md:w-1/2">
                                    <select className="bg-[#0b1410] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm w-2/3 outline-none focus:border-emerald-500 transition-colors" value={areaAssignments[auth.email] || ''} onChange={e => setAreaAssignments({ ...areaAssignments, [auth.email]: e.target.value })}>
                                        <option value="">{auth.department}</option>
                                        {locations.map((loc, index) => (<option key={index} value={loc.area}>{loc.area}</option>))}
                                    </select>
                                    <button onClick={() => handleAssignJurisdiction(auth.id, auth.email, auth.name)} className="bg-[#00592E] hover:bg-emerald-600 text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-wider transition-all">Save</button>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default: return null;
        }
    };
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
                <Slab color="#006e39" size="medium" text="" textColor="" />
            </div>
        );
    }
    return (
        <div className="flex h-screen bg-[#0b1410] overflow-hidden font-instrument text-gray-200">
            {/* --- SIDEBAR --- */}
            <div
                className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 lg:hidden
    ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* SIDEBAR */}
            <aside className={`fixed lg:static top-0 left-0 h-full w-72 bg-[#08100d] border-r border-gray-800 z-40
  transform transition-transform duration-300 ease-in-out
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0 flex flex-col shrink-0 shadow-2xl`}>
                <div className="h-24 flex flex-col justify-center px-8 border-b border-white/5">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <img
                            src="logo.png"
                            alt="Logo"
                            className="h-6 w-auto object-contain"
                        />
                        <h1 className="text-lg font-black text-white tracking-widest uppercase italic leading-none">CIVICLENS</h1>
                    </div>
                    <p className="text-[9px] font-bold text-emerald-500 tracking-[0.2em] mt-2 uppercase pl-9">System Admin Portal</p>
                </div>
                <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'Overview'} onClick={(label) => {
                        setActiveTab(label);
                        setIsSidebarOpen(false);
                    }} />
                    <NavItem icon={<Users size={20} />} label="Manage Authorities" active={activeTab === 'Manage Authorities'} onClick={(label) => {
                        setActiveTab(label);
                        setIsSidebarOpen(false);
                    }} />
                    <NavItem icon={<Map size={20} />} label="Assign Areas" active={activeTab === 'Assign Areas'} onClick={(label) => {
                        setActiveTab(label);
                        setIsSidebarOpen(false);
                    }} />

                </nav>
                <div className="p-6 border-t border-gray-800">
                    <button onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                    }} className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all border border-red-500/20">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0b1410]">
                <header className="px-4 md:px-10 py-6 md:py-8 border-b border-white/5 bg-[#0b1410]/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

                        {/* MOBILE MENU BUTTON */}
                        <button
                            className="lg:hidden text-white"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                            {activeTab}
                        </h2>

                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Management Console</p>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-10 pb-20 relative no-scrollbar">
                    {renderContent()}
                </div>
            </main>
            <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; }` }} />
        </div>
    );
};

export default AdminDashboard;