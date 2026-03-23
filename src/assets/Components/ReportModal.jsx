import React, { useState, useRef } from 'react';
import { useReports } from '../../context/ReportContext'; 
import { useAuth } from '../../context/AuthContext'; 

const ReportModal = ({ isOpen, onClose }) => {
    const { addReport } = useReports();
    const { user } = useAuth(); // Connects to the logged-in user
    
    const [formData, setFormData] = useState({
        name: '', 
        email: '',
        category: '',
        location: '',
        problem: '',
        image: null
    });
    
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); // Saves as Base64 for persistence
                setFormData({ ...formData, image: file });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDropZoneClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newReport = {
            id: `CL-${Date.now()}`, // Unique ID for Authority tracking
            title: formData.category,
            location: formData.location,
            // SYNC: Matches user identity so Analytics can filter it
            user: user?.username || formData.name || "Sana", 
            desc: formData.problem,
            img: preview || "/pothole.jpeg",
            status: 'PENDING', // Initial State
            time: new Date().toLocaleDateString()
        };

        addReport(newReport);
        alert("Report Submitted Successfully!");
        
        setFormData({ name: '', email: '', category: '', location: '', problem: '', image: null });
        setPreview(null);
        onClose();
    };

    return (
        <div className="report-overlay fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="report-modal-box bg-[#08100d] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden text-white">
                <div className="report-header flex justify-between items-center p-8 border-b border-white/5">
                    <h2 className="text-xl font-black uppercase tracking-widest">Submit your Report</h2>
                    <button className="text-2xl text-gray-500 hover:text-white transition-colors" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form-content p-8 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
                    <div className="field-group flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Your Name:</label>
                        <input className="bg-[#16221d] border-none rounded-xl p-3 outline-none focus:ring-1 ring-emerald-500" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div className="field-group flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Category:</label>
                        <select className="bg-[#16221d] border-none rounded-xl p-3 outline-none focus:ring-1 ring-emerald-500" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            <option value="" disabled>Select category</option>
                            <option value="Water Issues">Water Issues</option>
                            <option value="Road Conditions">Road Conditions</option>
                            <option value="Garbage Dumping">Garbage Dumping</option>
                        </select>
                    </div>

                    <div className="field-group flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Location:</label>
                        <input className="bg-[#16221d] border-none rounded-xl p-3 outline-none focus:ring-1 ring-emerald-500" type="text" required onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                    </div>

                    <div className="field-group flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Problem Details:</label>
                        <textarea className="bg-[#16221d] border-none rounded-xl p-3 outline-none focus:ring-1 ring-emerald-500 resize-none" rows="3" required onChange={(e) => setFormData({ ...formData, problem: e.target.value })} />
                    </div>

                    <div className="field-group flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Evidence:</label>
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
                        <div className="drop-zone border-2 border-dashed border-emerald-900/50 rounded-2xl h-32 flex items-center justify-center cursor-pointer overflow-hidden" onClick={handleDropZoneClick}>
                            {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-3xl text-emerald-600">↓</span>}
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95">
                        Submit Report
                    </button>
                </form>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; }`}} />
        </div>
    );
};

export default ReportModal;