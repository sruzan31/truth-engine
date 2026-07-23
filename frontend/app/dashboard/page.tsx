'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Shield,
  ShieldAlert,
  TrendingUp,
  CheckCircle,
  ArrowUpRight,
  BarChart3,
  History,
  AlertTriangle,
} from 'lucide-react';
import HistoryTable from '@/components/HistoryTable';
import Skeleton from '@/components/Skeleton';
import apiService from '@/services/api';
import { DashboardStats, AnalysisResult } from '@/types';
import { useAuth } from '@/components/AuthProvider';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scans, setScans] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsData, historyData] = await Promise.all([
          apiService.getDashboardStats(user?.uid ?? null),
          apiService.getHistory(user?.uid ?? null),
        ]);
        setStats(statsData);
        setScans(historyData);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch dashboard telemetry records.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const lowRiskCount = stats?.risk_breakdown.low || 0;
  const threatCount =
    (stats?.risk_breakdown.medium || 0) +
    (stats?.risk_breakdown.high || 0) +
    (stats?.risk_breakdown.critical || 0);
  const safePercentage = stats?.total_scans
    ? Math.round((lowRiskCount / stats.total_scans) * 100)
    : 0;

  return (
    <div className="space-y-8 py-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-end">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111827]/80 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#94A3B8] shadow-sm">
            <LayoutDashboard className="h-4 w-4 text-[#7C3AED]" />
            Security Command Center
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-white">Security & Trust Intelligence</h1>
            <p className="max-w-3xl text-sm leading-7 text-[#CBD5E1]">
              Command your security posture with live verification metrics, audit history, and risk insight from every scanned asset.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3B82F6]/20 transition hover:bg-[#2563EB]"
          >
            <span>Run Verification Scan</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <div className="rounded-full border border-white/10 bg-[#0F172A]/90 px-5 py-3 text-sm font-semibold text-[#CBD5E1]">
            {user?.email}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="truth-card p-5 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-2">
            <span className="text-[10px] font-mono font-semibold text-[#999999] uppercase">
              Total Inspections
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#111111]">
              {stats.total_scans}
            </div>
            <p className="text-[11px] text-[#666666]">Evaluated across all input channels</p>
          </div>

          <div className="truth-card p-5 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-2">
            <span className="text-[10px] font-mono font-semibold text-[#999999] uppercase">
              Mean Trust Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#111111]">
                {stats.average_trust_score}
              </span>
              <span className="text-xs font-mono font-semibold text-[#1F7A3E]">/100</span>
            </div>
            <p className="text-[11px] text-[#666666]">Platform-wide security average</p>
          </div>

          <div className="truth-card p-5 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-2">
            <span className="text-[10px] font-mono font-semibold text-[#999999] uppercase">
              Safe Verify Ratio
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#1F7A3E]">
              {safePercentage}%
            </div>
            <p className="text-[11px] text-[#666666]">{lowRiskCount} authentic items verified</p>
          </div>

          <div className="truth-card p-5 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-2">
            <span className="text-[10px] font-mono font-semibold text-[#999999] uppercase">
              Flagged Threats
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#C62828]">
              {threatCount}
            </div>
            <p className="text-[11px] text-[#666666]">Medium to Critical risk detections</p>
          </div>
        </div>
      ) : null}

      {/* Distribution Charts Section */}
      {stats && stats.total_scans > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Channels */}
          <div className="truth-card p-6 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
              <h3 className="text-xs font-mono font-bold uppercase text-[#111111]">
                Input Vector Distribution
              </h3>
              <span className="text-[10px] font-mono text-[#999999]">BY CATEGORY</span>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(stats.type_breakdown).map(([type, count]) => {
                const percent = stats.total_scans
                  ? Math.round((count / stats.total_scans) * 100)
                  : 0;
                return (
                  <div key={type} className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-[#111111] font-semibold uppercase">{type}</span>
                      <span className="text-[#666666]">
                        {count} scans ({percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F6F6F7] rounded-full overflow-hidden border border-[#E8E8E8]">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-[#111111] rounded-full transition-all duration-700"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk Level Breakdown */}
          <div className="truth-card p-6 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
              <h3 className="text-xs font-mono font-bold uppercase text-[#111111]">
                Risk Level Breakdown
              </h3>
              <span className="text-[10px] font-mono text-[#999999]">SECURITY CLASSIFICATION</span>
            </div>

            <div className="flex items-end justify-around py-4 h-48">
              {Object.entries(stats.risk_breakdown).map(([risk, count]) => {
                const percent = stats.total_scans
                  ? Math.round((count / stats.total_scans) * 100)
                  : 0;

                const getRiskFill = () => {
                  if (risk === 'low') return 'bg-[#1F7A3E]';
                  if (risk === 'medium') return 'bg-[#C08400]';
                  return 'bg-[#C62828]';
                };

                return (
                  <div key={risk} className="flex flex-col items-center gap-2">
                    <div className="h-32 w-10 bg-[#FAFAFA] rounded-lg border border-[#E8E8E8] flex flex-col justify-end overflow-hidden">
                      <div
                        style={{ height: `${percent}%` }}
                        className={`w-full ${getRiskFill()} transition-all duration-700`}
                      />
                    </div>
                    <div className="text-center font-mono text-[11px]">
                      <span className="font-bold text-[#111111] uppercase block">{risk}</span>
                      <span className="text-[#666666] text-[10px]">{count} ({percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* History Table Log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111111] uppercase font-mono tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-[#111111]" />
            Inspection Audit Log
          </h3>
        </div>

        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <HistoryTable scans={scans} />
        )}
      </div>
    </div>
  );
}