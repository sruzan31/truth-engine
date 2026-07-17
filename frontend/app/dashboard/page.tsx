'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, History, Shield, ShieldCheck, ShieldAlert, 
  BarChart3, RefreshCw, AlertTriangle, TrendingUp, CheckCircle 
} from 'lucide-react';
import HistoryTable from '@/components/HistoryTable';
import apiService from '@/services/api';
import { DashboardStats, AnalysisResult } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scans, setScans] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch dashboard statistics and complete history
        const [statsData, historyData] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getHistory(),
        ]);
        setStats(statsData);
        setScans(historyData);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch dashboard intelligence records.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 space-y-3">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-gray-400 font-mono uppercase tracking-widest">Loading Security Dashboard...</p>
      </div>
    );
  }

  // Calculate some visual breakdowns if stats exist
  const lowRiskCount = stats?.risk_breakdown.low || 0;
  const threatCount = (stats?.risk_breakdown.medium || 0) + (stats?.risk_breakdown.high || 0) + (stats?.risk_breakdown.critical || 0);
  const safePercentage = stats?.total_scans ? Math.round((lowRiskCount / stats.total_scans) * 100) : 0;

  return (
    <div className="flex-grow space-y-8 py-4">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 border border-primary/20 p-1.5 rounded-lg">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Security Command Center</h1>
            <p className="text-xs text-gray-400">Real-time threat feeds and digital safety statistics.</p>
          </div>
        </div>
        <Link
          href="/analyze"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary hover:brightness-110 active:scale-95 text-white font-bold text-xs tracking-wider transition-all cursor-pointer"
        >
          Verify Content
        </Link>
      </div>

      {error && (
        <div className="border border-rose-500/20 bg-rose-500/5 rounded-2xl p-4 flex gap-3 items-center">
          <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0" />
          <p className="text-xs text-gray-400">{error}</p>
        </div>
      )}

      {/* Grid Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total scans */}
          <div className="glass-panel rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-bl-full" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-mono">Total Inspections</span>
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-extrabold text-white font-mono">{stats.total_scans}</h3>
              <p className="text-[10px] text-gray-500">Scanned targets across all input nodes.</p>
            </div>
          </div>

          {/* Card 2: Average trust score */}
          <div className="glass-panel rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-secondary/5 rounded-bl-full" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-mono">Mean Trust Score</span>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-extrabold text-white font-mono">{stats.average_trust_score}</h3>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  stats.average_trust_score >= 80 ? 'bg-emerald-500' : (stats.average_trust_score >= 50 ? 'bg-amber-500' : 'bg-rose-500')
                )} />
                <span className="text-[10px] text-gray-500 capitalize">
                  {stats.average_trust_score >= 80 ? 'Established Safety' : (stats.average_trust_score >= 50 ? 'Moderate Alert' : 'Dangerous Average')}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Safe Rate */}
          <div className="glass-panel rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-bl-full" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-mono">Safe Verify Ratio</span>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-extrabold text-white font-mono">{safePercentage}%</h3>
              <p className="text-[10px] text-gray-500">{lowRiskCount} low-risk targets resolved safely.</p>
            </div>
          </div>

          {/* Card 4: Threats Blocked */}
          <div className="glass-panel rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-rose-500/5 rounded-bl-full" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-mono">Active Threats Flagged</span>
              <ShieldAlert className="h-4 w-4 text-rose-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-extrabold text-white font-mono">{threatCount}</h3>
              <p className="text-[10px] text-gray-500">Medium, High, and Critical threats identified.</p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Visualizers (Charts) */}
      {stats && stats.total_scans > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: Type breakdown */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-primary" /> Target Channels Distribution
            </h3>
            <div className="space-y-3.5 pt-2">
              {Object.entries(stats.type_breakdown).map(([type, count]) => {
                const percent = stats.total_scans ? Math.round((count / stats.total_scans) * 100) : 0;
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold font-mono">
                      <span className="text-gray-300 uppercase">{type}</span>
                      <span className="text-gray-400">{count} scans ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Threat trend */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 flex flex-col">
            <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-secondary" /> Risk Level Breakdown
            </h3>
            <div className="flex-grow flex items-center justify-around py-4">
              {Object.entries(stats.risk_breakdown).map(([risk, count]) => {
                const percent = stats.total_scans ? Math.round((count / stats.total_scans) * 100) : 0;
                
                let colorClass = 'bg-emerald-500';
                let textClass = 'text-emerald-400';
                if (risk === 'medium') { colorClass = 'bg-amber-500'; textClass = 'text-amber-400'; }
                if (risk === 'high') { colorClass = 'bg-orange-500'; textClass = 'text-orange-400'; }
                if (risk === 'critical') { colorClass = 'bg-rose-500'; textClass = 'text-rose-500'; }

                return (
                  <div key={risk} className="flex flex-col items-center gap-2">
                    <div className="relative h-24 w-12 bg-white/5 rounded-lg overflow-hidden border border-white/5 flex flex-col justify-end">
                      <div
                        style={{ height: `${percent}%` }}
                        className={cn('w-full rounded-b transition-all duration-1000', colorClass)}
                      />
                    </div>
                    <div className="text-center font-mono">
                      <p className={cn('text-xs font-bold capitalize', textClass)}>{risk}</p>
                      <p className="text-[10px] text-gray-500 font-semibold">{count} ({percent}%)</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* History table */}
      <div className="space-y-3">
        <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-1.5">
          <History className="h-4 w-4 text-primary animate-pulse-slow" /> Scans Inspection Log
        </h3>
        <HistoryTable scans={scans} />
      </div>
    </div>
  );
}
