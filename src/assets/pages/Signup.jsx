import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SendHorizontal } from 'lucide-react';

const Signup = () => {
  // Views: 'signup' or 'forgot'
  const [view, setView] = useState('signup'); 
  const [step, setStep] = useState(1); // For Forgot Password Steps (1: Email, 2: OTP)
  
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Normal User'
  });

  const [forgotEmail, setForgotEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.find(u => u.email === formData.email)) {
      alert("Email already exists!");
      return;
    }
    const newUser = { ...formData, username: `${formData.firstName}${formData.surname}`.toLowerCase() };
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
    alert("Signup Successful!");
    navigate('/login');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Logic to send OTP
      setStep(2);
    } else {
      // Logic to verify OTP
      alert("Verification successful! Check your email for reset link.");
      setView('signup');
      setStep(1);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050d0a] flex flex-col items-center justify-center font-instrument overflow-hidden p-4">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-5%] w-[400px] h-[400px] bg-green-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Logo */}
      <div className="absolute top-8 left-12">
        <h1 className="text-white text-2xl font-bold tracking-widest cursor-pointer" onClick={() => navigate('/')}>
          CIVICLENS
        </h1>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl bg-black/60 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl transition-all duration-500">
        
        {view === 'signup' ? (
          <>
            <h2 className="text-white text-5xl font-bold text-center mb-10 uppercase tracking-tight">SIGN UP</h2>
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div className="flex gap-4">
                <input type="text" name="firstName" placeholder="Enter Name" className="w-1/2 bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required onChange={handleChange} />
                <input type="text" name="surname" placeholder="Enter Surname" className="w-1/2 bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required onChange={handleChange} />
              </div>

              <input type="email" name="email" placeholder="Enter Email" className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required onChange={handleChange} />
              <input type="password" name="password" placeholder="Enter Password" className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required onChange={handleChange} />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 outline-none transition-all" required onChange={handleChange} />

              <div className="text-left">
                <button 
                  type="button" 
                  onClick={() => setView('forgot')}
                  className="text-xs text-gray-400 hover:text-emerald-400 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="w-full border border-white/40 py-4 rounded-xl text-white text-xl font-semibold hover:bg-white hover:text-black transition-all active:scale-[0.98]">
                Sign Up
              </button>

              <div className="text-right pt-4">
                <p className="text-gray-400 text-sm">
                  Already Signed in? <br />
                  <button type="button" onClick={() => navigate('/login')} className="text-white hover:underline font-medium cursor-pointer">
                    Try Logging in
                  </button>
                </p>
              </div>
            </form>
          </>
        ) : (
          /* --- FORGOT PASSWORD VIEW --- */
          <div className="max-w-md mx-auto py-4 transition-all">
            <button 
              onClick={() => setView('signup')}
              className="text-gray-400 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest mb-8 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Signup
            </button>

            <h2 className="text-white text-4xl font-bold mb-4 uppercase tracking-tight">
              {step === 1 ? "Reset Access" : "Verify OTP"}
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              {step === 1 
                ? "Enter your email to receive a 6-digit verification code." 
                : `Enter the code sent to ${forgotEmail}.`}
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-6">
              {step === 1 ? (
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white focus:border-emerald-500 outline-none transition-all"
                  required
                />
              ) : (
                <input
                  type="text"
                  maxLength="6"
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-transparent border border-white/20 p-4 rounded-xl text-white text-center text-xl tracking-widest focus:border-emerald-500 outline-none transition-all"
                  required
                />
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl text-white text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
              >
                {step === 1 ? "Send OTP" : "Verify & Reset"}
                <SendHorizontal size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;