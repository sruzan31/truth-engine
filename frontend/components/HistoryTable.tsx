'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowUpRight } from 'lucide-react';
import { AnalysisResult } from '@/types';
import { formatDate } from '@/lib/utils';

interface HistoryTableProps {
  scans: AnalysisResult[];
}

export default function HistoryTable({ scans }: HistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');

  // ⚡ Bolt: Memoize filtering to prevent O(N) recalculation on every re-render.
  // ⚡ Bolt: Hoist search LowerCase conversion to O(1) before the loop instead of O(N) inside.
  // Expected Impact: Eliminates redundant filtering work; faster typing feedback for large tables.
  const filteredScans = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return scans.filter((scan) => {
      const matchesSearch =
        scan.target.toLowerCase().includes(searchLower) ||
        scan.scan_id.toLowerCase().includes(searchLower);
      const matchesType = selectedType === 'all' || scan.scan_type === selectedType;
      const matchesRisk = selectedRisk === 'all' || scan.risk_level === selectedRisk;

      return matchesSearch && matchesType && matchesRisk;
    });
  }, [scans, searchTerm, selectedType, selectedRisk]);

  const getRiskBadge = (level: AnalysisResult['risk_level']) => {
    switch (level) {
      case 'low':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#1F7A3E] text-[10px] font-mono font-bold uppercase">
            LOW RISK
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#FFF8E1] text-[#C08400] text-[10px] font-mono font-bold uppercase">
            MEDIUM RISK
          </span>
        );
      case 'high':
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828] text-[10px] font-mono font-bold uppercase">
            HIGH THREAT
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#FAFAFA] text-[#666666] text-[10px] font-mono font-bold uppercase">
            UNKNOWN
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#FAFAFA] border border-[#E8E8E8]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by URL, file name, or Scan ID..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-xs font-mono text-[#111111] focus:outline-none"
          >
            <option value="all">ALL TYPES</option>
            <option value="url">WEBSITE</option>
            <option value="email">EMAIL</option>
            <option value="text">TEXT</option>
            <option value="image">IMAGE</option>
            <option value="pdf">PDF</option>
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-xs font-mono text-[#111111] focus:outline-none"
          >
            <option value="all">ALL RISKS</option>
            <option value="low">LOW RISK</option>
            <option value="medium">MEDIUM</option>
            <option value="high">HIGH / CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Enterprise Sticky Table Container */}
      <div className="truth-card overflow-hidden bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl shadow-sm">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#FAFAFA] border-b border-[#E8E8E8] z-10">
              <tr>
                <th className="px-5 py-3.5 text-[11px] font-mono font-semibold text-[#666666] uppercase">
                  Scan ID & Target
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-semibold text-[#666666] uppercase">
                  Type
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-semibold text-[#666666] uppercase">
                  Trust Score
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-semibold text-[#666666] uppercase">
                  Risk Assessment
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-semibold text-[#666666] uppercase">
                  Timestamp
                </th>
                <th className="px-5 py-3.5 text-[11px] font-mono font-semibold text-[#666666] uppercase text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-xs text-[#999999]">
                    No security scans match your filter query.
                  </td>
                </tr>
              ) : (
                filteredScans.map((scan, idx) => (
                  <tr
                    key={scan.scan_id}
                    className={`transition-colors hover:bg-[#F6F6F7] ${
                      idx % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#FAFAFA]/50'
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="space-y-0.5 max-w-xs">
                        <span className="text-[10px] font-mono text-[#999999]">
                          {scan.scan_id}
                        </span>
                        <p className="text-xs font-semibold text-[#111111] font-mono truncate">
                          {scan.target}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded bg-[#FAFAFA] border border-[#E8E8E8] font-mono text-[10px] font-bold text-[#111111] uppercase">
                        {scan.scan_type}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`font-mono text-sm font-bold ${
                          scan.trust_score > 80
                            ? 'text-[#1F7A3E]'
                            : scan.trust_score > 50
                            ? 'text-[#C08400]'
                            : 'text-[#C62828]'
                        }`}
                      >
                        {scan.trust_score}/100
                      </span>
                    </td>

                    <td className="px-5 py-4">{getRiskBadge(scan.risk_level)}</td>

                    <td className="px-5 py-4 text-xs font-mono text-[#666666]">
                      {formatDate(scan.created_at)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/results/${scan.scan_id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#111111] hover:bg-black text-white text-[11px] font-medium transition-all"
                      >
                        <span>Report</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
