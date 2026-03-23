import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [loginData, setLoginData] = useState({ 
    identifier: '', 
    password: '', 
    role: 'Normal User',
    otp: '' 
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // 1. Function to trigger OTP
  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!loginData.identifier) return alert("Please enter your Email or Username");
    
    // Simulate sending OTP
    alert("OTP sent to your registered device! (Use 123456 for demo)");
    setIsOtpSent(true);
  };

  // 2. Main Login / Verify Function
  const handleLogin = (e) => {
    e.preventDefault();
    const { identifier, password, role, otp } = loginData;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => 
      (u.email === identifier || u.username === identifier) && 
      u.role === role
    );

    if (!foundUser) return alert("Account not found for this User Type.");

    // Check if we are verifying OTP or Password
    if (isOtpSent) {
      if (otp === '123456') { // Mock OTP Check
        login(foundUser);
        navigate('/');
      } else {
        alert("Invalid OTP code.");
      }
    } else {
      // Standard Password Login
      if (foundUser.password === password) {
        login(foundUser);
        navigate('/');
      } else {
        alert("Incorrect password.");
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050d0a] flex flex-col items-center justify-center font-instrument overflow-hidden">
         <div className="absolute top-8 left-12">
        <h1 className="text-white text-2xl font-bold tracking-widest">CIVICLENS</h1>
      </div>

      <div className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-5%] w-[400px] h-[400px] bg-green-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg bg-black/60 backdrop-blur-xl border border-white/5 p-12 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-white text-4xl font-bold text-center mb-10 uppercase tracking-tighter">
          {isOtpSent ? "Verify OTP" : "Login"}
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em] ml-1">User Type</label>
            <select 
              className="w-full bg-[#0a1a14] border border-white/10 p-4 rounded-xl text-white outline-none focus:border-emerald-500 transition-all cursor-pointer text-sm"
              value={loginData.role}
              onChange={(e) => setLoginData({...loginData, role: e.target.value})}
              disabled={isOtpSent}
            >
              <option value="Normal User">Citizen / User</option>
              <option value="Government Authority">Government Authority</option>
              <option value="Admin">System Admin</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Email or Username"
            className="w-full bg-transparent border border-white/10 p-4 rounded-xl text-white focus:border-emerald-500 outline-none transition-all"
            required
            disabled={isOtpSent}
            onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
          />

          {!isOtpSent ? (
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border border-white/10 p-4 rounded-xl text-white placeholder:text-gray-600 focus:border-emerald-500 outline-none transition-all"
              required
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
          ) : (
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              className="w-full bg-transparent border border-white/10 p-4 rounded-xl text-white text-center text-2xl tracking-[0.5em] focus:border-emerald-500 outline-none transition-all"
              required
              onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })}
            />
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full bg-[#00592E] hover:bg-emerald-600 text-white py-5 rounded-xl font-bold text-xl transition-all shadow-lg shadow-emerald-900/40 active:scale-95"
            >
              {isOtpSent ? "Log In" : "Log In with Password"}
            </button>

            {!isOtpSent && (
              <button
                type="button"
                onClick={handleRequestOtp}
                className="text-xs text-emerald-500 font-bold hover:text-emerald-400 transition-colors py-2"
              >
                Or Login with OTP
              </button>
            )}
            
            {isOtpSent && (
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="text-xs text-gray-500  py-2"
              >
                Back to Password Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;