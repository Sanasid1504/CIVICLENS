/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem("civicReports");
    return savedReports ? JSON.parse(savedReports) : [];
  });

  useEffect(() => {
    localStorage.setItem("civicReports", JSON.stringify(reports));
  }, [reports]);

  const addReport = (newReport) => {
    const formattedReport = {
      ...newReport,
      id: `CL-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'PENDING',
      time: 'Just now'
    };
    setReports((prev) => [formattedReport, ...prev]);
  };

  // --- ADD THIS FUNCTION ---
  const updateReportStatus = (id, newStatus) => {
    setReports((prevReports) => 
      prevReports.map((report) => 
        report.id === id ? { ...report, status: newStatus } : report
      )
    );
  };

  return (
    <ReportContext.Provider value={{ reports, addReport, updateReportStatus }}>
      {children}
    </ReportContext.Provider>
  );
};

export function useReports() {
  return useContext(ReportContext);
}