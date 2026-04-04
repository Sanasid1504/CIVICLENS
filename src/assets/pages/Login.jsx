import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, ShieldCheck, Mail } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [loginData, setLoginData] = useState({ 
    identifier: '', 
    password: '' 
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Main Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    const { identifier, password } = loginData;

    try {
      // --- LOCAL STORAGE MOCK LOGIC ---
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => 
        (u.email === identifier || u.username === identifier)
      );

      if (!foundUser) return alert("Account not found. Please check your credentials.");

      const completeLogin = (user) => {
        // This ensures the Chatbot sees the role
        localStorage.setItem("role", user.role); 
        login(user);

        // Redirect based on role (defaulting to "/" as per your logic)
        navigate("/");
      };

      if (foundUser.password === password) {
        completeLogin(foundUser);
      } else {
        alert("Incorrect password.");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("An error occurred during login.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // The frontend received a secure token from Google
      const token = credentialResponse.credential;
      console.log("✅ SUCCESS! Google Token Generated:", token); // <-- Added for easy verification

      // Pass the token to the backend for verification
      const response = await fetch('http://localhost:8000/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the backend returns a user object
        const user = data.user || data; 
        
        // Save role constraint seen in the existing login logic
        localStorage.setItem("role", user.role || 'Normal User'); 
        login(user);
        navigate("/");
      } else {
        console.error("Backend validation failed", await response.text());
        alert("Google Login failed server verification.");
      }
    } catch (error) {
      console.error("Error communicating with backend during Google Login", error);
      alert("Network error during Google Login.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050d0a] flex flex-col items-center justify-center font-instrument overflow-x-hidden p-4">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-[-20%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-green-900/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Top Logo - UPDATED WITH LOGO IMAGE */}
      <div className="absolute top-6 md:top-8 left-6 md:left-12 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <img 
          src="/images/logo.png" 
          alt="CivicLens Logo" 
          className="h-8 md:h-10 w-auto object-contain" 
        />
        <h1 className="text-white text-xl md:text-2xl font-bold tracking-widest uppercase italic">
          CIVICLENS
        </h1>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl transition-all duration-500 mt-12 md:mt-0">
        
        <div className="text-center mb-8 md:mb-10">
            <h2 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tighter">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest mt-2 font-semibold">
              Login to your account
            </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
                type="text"
                placeholder="Email or Username"
                className="w-full bg-[#0a1a14]/50 border border-white/10 p-4 pl-12 rounded-xl text-white placeholder:text-gray-600 focus:border-emerald-500 outline-none transition-all text-sm font-normal"
                required
                value={loginData.identifier}
                onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
            />
          </div>

          <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#0a1a14]/50 border border-white/10 p-4 pl-12 rounded-xl text-white placeholder:text-gray-600 focus:border-emerald-500 outline-none transition-all text-sm font-normal"
              required
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <button
              type="submit"
              className="w-full bg-[#00592E] hover:bg-[#006e39] text-white py-4 md:py-5 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 w-full border-t border-white/5 pt-6">
          <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-2">
            Or continue with
          </p>
          <div className="w-full flex justify-center scale-105">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.error('Google Login Failed');
                alert('Google Login encountered an error.');
              }}
              theme="filled_black"
              shape="pill"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-600 text-[10px] md:text-xs uppercase tracking-widest font-semibold">
                Don't have an account? 
                <button 
                    onClick={() => navigate('/signup')} 
                    className="text-white ml-2 font-black hover:underline"
                >
                    Create One
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;