'use client';

import React, { useState, useEffect } from 'react';
import { History, ShieldAlert, Download } from 'lucide-react';
import HistoryTable from '@/components/HistoryTable';
import Skeleton from '@/components/Skeleton';
import apiService from '@/services/api';
import { AnalysisResult } from '@/types';
import { useAuth } from '@/components/AuthProvider';

export default function HistoryPage() {
  const { user } = useAuth();
  const [scans, setScans] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getHistory(user?.uid ?? null);
        setScans(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch historical security scan records.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  return (
    <div className="space-y-8 py-6">
      <div className="rounded-[32px] border border-white/10 bg-[#0B1121]/95 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111827]/85 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[#94A3B8]">
              <History className="h-4 w-4 text-[#7C3AED]" />
              Audit Archive
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-white">Security Audit Archive</h1>
              <p className="mt-2 text-sm leading-7 text-[#CBD5E1]">
                Immutable evidence of every verification scan, available for compliance reporting and investigation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scans, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', 'truth_engine_audit_log.json');
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#3B82F6] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3B82F6]/20 transition hover:bg-[#2563EB]"
          >
            <Download className="h-4 w-4" />
            Export Audit Log
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-[28px] border border-[#F87171]/20 bg-[#7F1D1D]/10 p-4 text-sm text-[#FECACA] shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#FECACA]" />
            <span>{error}</span>
          </div>
        </div>
      ) : null}

      <div className="rounded-[32px] border border-white/10 bg-[#0F172A]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
        {loading ? <Skeleton className="h-96 w-full rounded-[28px]" /> : <HistoryTable scans={scans} />}
      </div>
    </div>
  );
}
