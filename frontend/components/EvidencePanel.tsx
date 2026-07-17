'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, ArrowUpRight } from 'lucide-react';
import { EvidenceItem } from '../types';
import { cn } from '@/lib/utils';

interface EvidencePanelProps {
  evidence: EvidenceItem[];
}

export default function EvidencePanel({ evidence }: EvidencePanelProps) {
  // Sort evidence by weight descending
  const sortedEvidence = [...evidence].sort((a, b) => b.weight - a.weight);

  const getStatusIcon = (status: EvidenceItem['status']) => {
    switch (status) {
      case 'success':
        return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'danger':
        return <ShieldAlert className="h-5 w-5 text-rose-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-cyan-400" />;
    }
  };

  const getStatusBg = (status: EvidenceItem['status']) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'danger':
        return 'bg-rose-500/10 border-rose-500/20';
      case 'info':
        return 'bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-tight">Security Evidence Log</h3>
        <span className="text-xs text-gray-400 font-medium font-mono bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
          {evidence.length} Indicators Checked
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {sortedEvidence.map((item, index) => (
          <motion.div
            key={`${item.title}-${index}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={cn(
              'border rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative overflow-hidden group hover:bg-white/5 transition-colors duration-300',
              getStatusBg(item.status)
            )}
          >
            {/* Shimmer element on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 rounded-lg p-1.5 bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
                {getStatusIcon(item.status)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono tracking-widest text-primary uppercase">
                    {item.category}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gray-600" />
                  <span className="text-xs text-gray-400 font-semibold">
                    Weight: {Math.round(item.weight * 100)}%
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm tracking-wide leading-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Score component */}
            <div className="flex flex-col items-end gap-1 shrink-0 mt-3 md:mt-0 w-full md:w-auto border-t md:border-t-0 pt-2.5 md:pt-0 border-white/5">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold font-mono text-white">
                  {Math.round(item.score)}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">/100</span>
              </div>
              <div className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                TRUST SCORE
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
