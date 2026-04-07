import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { X, UploadCloud, MapPin, Tag, AlignLeft, User, Loader2 } from 'lucide-react';
import Apiclient from '../api/Api';

const ReportModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate(); 
    
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(""); 

    const [formData, setFormData] = useState({
        name: '',
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
        setImageError(""); 

        if (file) {
            if (!file.type.startsWith("image/")) {
                setImageError("Select a valid image file.");
                return;
            }
            setPreview(URL.createObjectURL(file));
            setFormData({ ...formData, image: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            setImageError("Clear evidence is required.");
            return;
        }

        setLoading(true);

        let finalImageUrl = "";

        const data = new FormData();
        data.append("file", formData.image);
        data.append("upload_preset", "igjhrgaz"); 
        data.append("cloud_name", "djh53l930");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/djh53l930/image/upload", {
                method: "POST",
                body: data,
            });
            const resData = await res.json();
            finalImageUrl = resData.secure_url;
        } catch (err) {
            alert("Image upload failed");
            setLoading(false);
            return;
        }

        let latitude = null;
        let longitude = null;

        try {
            const position = await new Promise((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject)
            );

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

        } catch (err) {
            alert("Location access required");
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("Token");

        try {
            await Apiclient.post("/complaint/", {
                title: formData.category,
                description: formData.problem,
                category: formData.category,
                latitude: latitude,
                longitude: longitude,
                image_url: finalImageUrl
            }, {
                headers: {
                    Authorization: token
                }
            });

            alert("Complaint submitted");

            setFormData({
                name: '',
                category: '',
                location: '',
                problem: '',
                image: null
            });

            setPreview(null);
            onClose();
            navigate('/user-home');

        } catch (err) {
            alert(err.response?.data?.detail || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#08100d] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden text-white">
                
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase italic bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                        Submit Report
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                    
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <User size={12}/> Title
                        </label>
                        <input 
                            className="w-full bg-[#050d0a] border border-white/5 rounded-xl p-3 text-sm outline-none"
                            type="text" required value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <Tag size={12}/> Category
                        </label>
                        <select 
                            className="w-full bg-[#050d0a] border border-white/5 rounded-xl p-3 text-sm outline-none"
                            required value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="">Select Issue</option>
                            <option value="Water">Water Issues</option>
                            <option value="Roads">Road Conditions</option>
                            <option value="Waste">Garbage Dumping</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <MapPin size={12}/> Location
                        </label>
                        <input 
                            className="w-full bg-[#050d0a] border border-white/5 rounded-xl p-3 text-sm outline-none"
                            type="text" required placeholder="Optional (for user reference)"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <AlignLeft size={12}/> Details
                        </label>
                        <textarea 
                            className="w-full bg-[#050d0a] border border-white/5 rounded-xl p-3 text-sm min-h-[80px]"
                            required value={formData.problem}
                            onChange={(e) => setFormData({...formData, problem: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            className={`border-2 border-dashed rounded-2xl h-24 flex items-center justify-center cursor-pointer bg-[#050d0a] ${imageError ? 'border-red-500/50' : 'border-white/10 hover:border-emerald-500/50'}`}
                        >
                            {preview ? (
                                <img src={preview} className="h-full w-full object-cover rounded-2xl" alt="preview" />
                            ) : (
                                <UploadCloud size={24} />
                            )}
                        </div>
                        {imageError && <p className="text-[9px] text-red-500 text-center">{imageError}</p>}
                    </div>

                    <button 
                        type="submit"
                        disabled={loading || !!imageError || !formData.image}
                        className="w-full py-4 rounded-xl font-black uppercase text-[11px] tracking-widest bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={14} />}
                        {loading ? "PROCESSING..." : "SUBMIT REPORT"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;