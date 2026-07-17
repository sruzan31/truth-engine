'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Shield, Key, Eye, HelpCircle, AlertTriangle, CheckCircle, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        console.error('Could not connect to FastAPI server:', err);
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
    <div className="flex-grow max-w-3xl mx-auto w-full space-y-8 py-4">
      {/* Title Header */}
      <div className="flex items-center gap-2.5 border-b border-white/5 pb-4">
        <div className="bg-primary/10 border border-primary/20 p-1.5 rounded-lg">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Configuration Settings</h1>
          <p className="text-xs text-gray-400">Manage security settings, API connections, and user data cache.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* API Credentials and Engine Status */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
            <Key className="h-4.5 w-4.5 text-primary" /> Core Trust Intelligence Status
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            The Truth Engine operates in <strong className="text-white">Hybrid Mode</strong>. If third-party keys are not found in the environment (`.env`), the backend automatically routes requests to simulated analyzers utilizing offline deterministic models.
          </p>

          <div className="border-t border-white/5 pt-4 space-y-3.5">
            {loading ? (
              <p className="text-xs text-gray-500 font-mono animate-pulse">Checking API statuses...</p>
            ) : serverStatus ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Google Gemini 2.5 API',
                    mock: serverStatus.mock_mode.gemini,
                    desc: 'Drives explainable AI summaries and language scam parsing.',
                  },
                  {
                    name: 'VirusTotal Threat Intel',
                    mock: serverStatus.mock_mode.virustotal,
                    desc: 'Searches public URL and domain reputation lists.',
                  },
                  {
                    name: 'Google Safe Browsing API',
                    mock: serverStatus.mock_mode.safebrowsing,
                    desc: 'Scans URLs for registered phishing/malware listings.',
                  },
                  {
                    name: 'MongoDB Atlas Integration',
                    mock: serverStatus.mock_mode.mongodb,
                    desc: 'Persists user scans, dashboards, and audit history logs.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border border-white/5 bg-black/20 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      {item.mock ? (
                        <span className="text-[9px] font-bold font-mono tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Offline / Mocked
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold font-mono tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active / Live
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-rose-500/20 bg-rose-500/5 rounded-xl p-4 flex gap-3 items-center">
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
                <p className="text-xs text-gray-400 leading-normal">
                  Failed to connect to the FastAPI backend. Make sure the server is active on <code className="text-white font-mono">http://localhost:8000</code>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Clear Data & Security Panels */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
            <Database className="h-4.5 w-4.5 text-primary" /> Browser Session Cache
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Verify metrics, credentials tokens, and local cache entries are maintained exclusively inside your browser storage for safety.
          </p>

          <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-xs tracking-wide">Purge Local Configuration</h4>
              <p className="text-[10px] text-gray-500 max-w-sm leading-normal">
                Resets local mock authentication state and browser metadata settings. This will NOT clear server records stored in MongoDB Atlas.
              </p>
            </div>
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              {cleared ? 'Cleared!' : 'Purge Cache'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
