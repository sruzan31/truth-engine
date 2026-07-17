'use client';

import React, { useState, useEffect } from 'react';
import { History, RefreshCw, ShieldAlert } from 'lucide-react';
import HistoryTable from '@/components/HistoryTable';
import apiService from '@/services/api';
import { AnalysisResult } from '@/types';

export default function HistoryPage() {
  const [scans, setScans] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getHistory();
        setScans(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch the scan history logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 space-y-3">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-gray-400 font-mono uppercase tracking-widest">Loading Scan History...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow space-y-6 py-4">
      {/* Title Header */}
      <div className="flex items-center gap-2.5 border-b border-white/5 pb-4">
        <div className="bg-primary/10 border border-primary/20 p-1.5 rounded-lg">
          <History className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Inspections Archives</h1>
          <p className="text-xs text-gray-400">Complete historical index of website reputation audits and file checks.</p>
        </div>
      </div>

      {error && (
        <div className="border border-rose-500/20 bg-rose-500/5 rounded-2xl p-4 flex gap-3 items-center">
          <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0" />
          <p className="text-xs text-gray-400">{error}</p>
        </div>
      )}

      {/* History table wrapper */}
      <HistoryTable scans={scans} />
    </div>
  );
}
