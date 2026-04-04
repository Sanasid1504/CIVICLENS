import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useReports } from '../../context/ReportContext'; 
import { useAuth } from '../../context/AuthContext'; 
import { X, UploadCloud, MapPin, Tag, AlignLeft, User, Loader2 } from 'lucide-react';

const ReportModal = ({ isOpen, onClose }) => {
    const { addReport } = useReports();
    const { user } = useAuth(); 
    const navigate = useNavigate(); 
    
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(""); 
    const [formData, setFormData] = useState({
        name: user?.username || '', 
        category: '',
        location: '',
        problem: '',
        image: null 
    });
    
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    // --- BLUR DETECTION CORE LOGIC ---
    const detectBlur = (imgElement) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        ctx.drawImage(imgElement, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let grayscale = [];
        for (let i = 0; i < data.length; i += 4) {
            grayscale.push(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        }

        const laplacian = [0, 1, 0, 1, -4, 1, 0, 1, 0];
        let laplacianData = [];
        let mean = 0;

        for (let y = 1; y < canvas.height - 1; y++) {
            for (let x = 1; x < canvas.width - 1; x++) {
                let val = 0;
                for (let j = -1; j <= 1; j++) {
                    for (let k = -1; k <= 1; k++) {
                        val += grayscale[(y + j) * canvas.width + (x + k)] * laplacian[(j + 1) * 3 + (k + 1)];
                    }
                }
                laplacianData.push(val);
                mean += val;
            }
        }
        mean /= laplacianData.length;
        let variance = 0;
        for (let i = 0; i < laplacianData.length; i++) {
            variance += Math.pow(laplacianData[i] - mean, 2);
        }
        return variance / laplacianData.length;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageError(""); 

        if (file) {
            if (!file.type.startsWith("image/")) {
                setImageError("Select a valid image file.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result;

                img.onload = () => {
                    // Check Dimensions first
                    if (img.width < 400 || img.height < 400) {
                        setImageError("Image is too small for analysis.");
                        return;
                    }

                    // Perform Blur Detection
                    const blurScore = detectBlur(img);
                    
                    // Threshold: < 80 is considered blurry for civic evidence
                    if (blurScore < 80) {
                        setImageError("REJECTED: Photo is too blurry. Please take a sharper image.");
                        setPreview(null);
                        setFormData({ ...formData, image: null });
                    } else {
                        setPreview(reader.result);
                        setFormData({ ...formData, image: file });
                        setImageError(""); 
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            setImageError("Clear evidence is strictly required.");
            return;
        }

        setLoading(true);
        let finalImageUrl = "/pothole.jpeg"; 

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
            if (resData.secure_url) finalImageUrl = resData.secure_url;
        } catch (err) {
            console.error("Upload Failed:", err);
        }

        const newReport = {
            id: `CL-${Date.now()}`, 
            title: formData.category,
            location: formData.location,
            user: user?.username || formData.name || "Citizen", 
            desc: formData.problem,
            img: finalImageUrl, 
            status: 'PENDING', 
            time: new Date().toLocaleDateString()
        };

        addReport(newReport);
        setLoading(false);
        alert("Report Submitted with Sharp Evidence!");
        setFormData({ name: '', category: '', location: '', problem: '', image: null });
        setPreview(null);
        onClose();
        navigate('/user-dashboard'); 
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#08100d] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden text-white">
                
                {/* HEADER */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase italic bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                        Submit Report
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                    
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <User size={12}/> Name
                        </label>
                        <input 
                            className="w-full bg-[#050d0a] border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-emerald-500/50"
                            type="text" required value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <Tag size={12}/> Category
                        </label>
                        <select 
                            className="w-full bg-[#050d0a] border border-white/5 rounded-xl p-3 text-sm outline-none appearance-none"
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
                            type="text" required placeholder="Where is this?"
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

                    {/* UPLOAD AREA */}
                    <div className="space-y-2">
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            className={`border-2 border-dashed rounded-2xl h-24 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#050d0a] ${imageError ? 'border-red-500/50' : 'border-white/10 hover:border-emerald-500/50'}`}
                        >
                            {preview ? (
                                <img src={preview} className="h-full w-full object-cover rounded-2xl" alt="preview" />
                            ) : (
                                <div className="text-center">
                                    <UploadCloud className={`mx-auto ${imageError ? 'text-red-500/50' : 'text-emerald-500/50'}`} size={24} />
                                    <span className={`text-[10px] uppercase font-bold ${imageError ? 'text-red-500' : 'text-gray-500'}`}>
                                        {imageError ? imageError : "Add Evidence"}
                                    </span>
                                </div>
                            )}
                        </div>
                        {imageError && <p className="text-[9px] text-red-500 font-black uppercase text-center">{imageError}</p>}
                    </div>

                    <button 
                        type="submit"
                        disabled={loading || !!imageError || !formData.image}
                        className={`w-full py-4 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all flex items-center justify-center gap-2 ${ (loading || imageError || !formData.image) ? "bg-gray-800 cursor-not-allowed opacity-50" : "bg-emerald-600 hover:bg-emerald-500"}`}
                    >
                        {loading && <Loader2 className="animate-spin" size={14} />}
                        {loading ? "PROCESSING..." : imageError ? "BLURRY IMAGE REJECTED" : "SUBMIT REPORT"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;