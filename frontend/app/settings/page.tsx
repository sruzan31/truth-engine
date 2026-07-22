'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Key, Database, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';

export default function SettingsPage() {
  const [serverStatus, setServerStatus] = useState<{
    status: string;
    mock_mode: {
      gemini: boolean;
      virustotal: boolean;
      safebrowsing: boolean;
      mongodb: boolean;
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:8000/');
        if (res.ok) {
          const data = await res.json();
          setServerStatus(data);
        }
      } catch (err) {
        console.error('Could not connect to backend server:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('truth_engine_user');
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="space-y-1 border-b border-[#E8E8E8] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#E8E8E8] text-xs font-mono text-[#111111]">
          <Settings className="w-3.5 h-3.5" />
          <span>CONFIGURATION</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight">
          System Settings & API Telemetry
        </h1>
        <p className="text-xs text-[#666666]">
          Manage security integrations, engine status, and local session storage.
        </p>
      </div>

      <div className="space-y-6">
        {/* Core Status Card */}
        <div className="truth-card p-6 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
            <h3 className="text-xs font-mono font-bold uppercase text-[#111111]">
              Threat Intelligence Engine Status
            </h3>
            <span className="text-[10px] font-mono text-[#999999]">HYBRID ARCHITECTURE</span>
          </div>

          <p className="text-xs text-[#666666] leading-relaxed">
            Truth Engine automatically routes verification requests through live APIs or offline deterministic models based on environment configurations.
          </p>

          <div className="pt-2">
            {loading ? (
              <p className="text-xs text-[#999999] font-mono animate-pulse">Checking node connectivity...</p>
            ) : serverStatus ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    name: 'Google Gemini 2.5 API',
                    mock: serverStatus.mock_mode.gemini,
                    desc: 'Explainable AI summaries & synthetic language forensics.',
                  },
                  {
                    name: 'VirusTotal Threat Intel',
                    mock: serverStatus.mock_mode.virustotal,
                    desc: 'Public URL & malware domain blacklists.',
                  },
                  {
                    name: 'Google Safe Browsing API',
                    mock: serverStatus.mock_mode.safebrowsing,
                    desc: 'Phishing domain database cross-referencing.',
                  },
                  {
                    name: 'MongoDB Atlas Storage',
                    mock: serverStatus.mock_mode.mongodb,
                    desc: 'Persists user scans and security audit logs.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111]">{item.name}</span>
                      {item.mock ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#C08400] text-[9px] font-mono font-bold uppercase border border-[#FFE082]">
                          OFFLINE / SIMULATED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1F7A3E] text-[9px] font-mono font-bold uppercase border border-[#C8E6C9]">
                          ACTIVE / LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#666666] leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Backend offline. Ensure FastAPI is running on http://localhost:8000.</span>
              </div>
            )}
          </div>
        </div>

        {/* Local Session Card */}
        <div className="truth-card p-6 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
            <h3 className="text-xs font-mono font-bold uppercase text-[#111111]">
              Browser Cache & Session Purge
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#111111]">Clear Local Session Tokens</h4>
              <p className="text-[11px] text-[#666666]">
                Removes local browser preferences and cached scan IDs. Server data remains intact.
              </p>
            </div>

            <button
              onClick={handleClearHistory}
              type="button"
              className="px-4 py-2 rounded-full bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#C62828] text-xs font-semibold transition-all shrink-0"
            >
              {cleared ? 'Cache Cleared' : 'Purge Browser Cache'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
