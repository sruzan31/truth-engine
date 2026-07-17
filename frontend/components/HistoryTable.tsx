'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Link2, Mail, FileText, Image as ImageIcon, QrCode, FileCheck, 
  ExternalLink, Search, ShieldAlert, ArrowUpDown, Calendar 
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { cn, formatDate } from '@/lib/utils';

interface HistoryTableProps {
  scans: AnalysisResult[];
}

export default function HistoryTable({ scans }: HistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const getScanIcon = (type: AnalysisResult['scan_type']) => {
    switch (type) {
      case 'url':
        return <Link2 className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'qr':
        return <QrCode className="h-4 w-4" />;
      case 'pdf':
        return <FileCheck className="h-4 w-4" />;
    }
  };

  const getRiskBadge = (risk: AnalysisResult['risk_level']) => {
    switch (risk) {
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Low
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Medium
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            High
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-500 border border-rose-500/25">
            Critical
          </span>
        );
    }
  };

  // Filter scans
  const filteredScans = scans.filter((scan) => {
    const matchesSearch = scan.target.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          scan.recommendation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || scan.scan_type === typeFilter;
    const matchesRisk = riskFilter === 'all' || scan.risk_level === riskFilter;
    return matchesSearch && matchesType && matchesRisk;
  });

  return (
    <div className="space-y-4">
      {/* Filters Area */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search scans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Type Select */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="block w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary transition-all cursor-pointer"
        >
          <option value="all">All Content Types</option>
          <option value="url">Websites / URLs</option>
          <option value="email">Emails</option>
          <option value="text">Raw Texts</option>
          <option value="image">Images</option>
          <option value="qr">QR Codes</option>
          <option value="pdf">PDF Documents</option>
        </select>

        {/* Risk Select */}
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="block w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary transition-all cursor-pointer"
        >
          <option value="all">All Risk Levels</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
          <option value="critical">Critical Risk</option>
        </select>
      </div>

      {/* Scans List Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          {filteredScans.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <ShieldAlert className="h-8 w-8 text-gray-600 mx-auto" />
              <h4 className="text-sm font-semibold text-gray-400">No records found</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                No scans match the current filters. Start a new verify scan from the console page.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                  <th className="py-3.5 px-4">Content Target</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Type</th>
                  <th className="py-3.5 px-4 text-center">Score</th>
                  <th className="py-3.5 px-4">Risk Level</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Scanned Date</th>
                  <th className="py-3.5 px-4 text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                {filteredScans.map((scan) => (
                  <tr key={scan.scan_id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Target name */}
                    <td className="py-3 px-4 font-semibold text-white max-w-[200px] sm:max-w-xs truncate">
                      {scan.target}
                    </td>

                    {/* Scan type */}
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-gray-400">
                        <span className="bg-white/5 border border-white/5 p-1 rounded">
                          {getScanIcon(scan.scan_type)}
                        </span>
                        {scan.scan_type}
                      </div>
                    </td>

                    {/* Trust score */}
                    <td className="py-3 px-4 text-center font-bold font-mono text-white">
                      {scan.trust_score}
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3 px-4">{getRiskBadge(scan.risk_level)}</td>

                    {/* Date */}
                    <td className="py-3 px-4 hidden md:table-cell text-gray-400 font-mono">
                      {formatDate(scan.created_at)}
                    </td>

                    {/* Link */}
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/results/${scan.scan_id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300 hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all"
                      >
                        Details <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
