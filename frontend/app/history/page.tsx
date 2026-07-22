'use client';

import React, { useState, useEffect } from 'react';
import { History, ShieldAlert, Download } from 'lucide-react';
import HistoryTable from '@/components/HistoryTable';
import Skeleton from '@/components/Skeleton';
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
        setError('Failed to fetch historical security scan records.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 py-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8E8E8] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#E8E8E8] text-xs font-mono text-[#111111]">
            <History className="w-3.5 h-3.5" />
            <span>AUDIT ARCHIVE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight">
            Security Audit Archive
          </h1>
          <p className="text-xs text-[#666666]">
            Immutable record of all historical content verifications and threat evaluations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scans, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "truth_engine_audit_log.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E8E8E8] hover:bg-[#FAFAFA] text-[#111111] text-xs font-semibold inline-flex items-center gap-2 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <HistoryTable scans={scans} />
      )}
    </div>
  );
}
