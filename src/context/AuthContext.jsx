/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Logged-in user ka state (localStorage se uthaya gaya)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("civicUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Default System Accounts (Sirf pehli baar setup ke liye)
  const systemAccounts = [
    { 
      email: "admin@civic.com", 
      password: "123", 
      role: "Admin", 
      department: "All",
      area: "Central" 
    },
    { 
      email: "water_dept@civic.com", 
      password: "123", 
      role: "Government Authority", 
      department: "Water Issues",
      area: "Zone A" 
    },
    { 
      email: "road_dept@civic.com", 
      password: "123", 
      role: "Government Authority", 
      department: "Road Conditions",
      area: "Zone B" 
    }
  ];

  // 3. System Accounts ko LocalStorage mein initialize karna
  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    let updatedUsers = [...existingUsers];
    let needsUpdate = false;

    systemAccounts.forEach(sysAcc => {
      // Agar ye email pehle se nahi hai, toh hi add karo
      if (!updatedUsers.some(u => u.email === sysAcc.email)) {
        updatedUsers.push(sysAcc);
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
  }, )

  // 4. Admin Feature: Naye Authority ko add karna
  const addUser = (newUserInfo) => {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check agar user pehle se exist toh nahi karta
    if (existingUsers.some(u => u.email === newUserInfo.email)) {
      alert("This email is already registered!");
      return;
    }

    const updatedUsers = [...existingUsers, newUserInfo];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert(`Authority for ${newUserInfo.department} added successfully!`);
  };

  // 5. Login & Logout Actions
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("civicUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("civicUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. Custom Hook use karne ke liye
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};