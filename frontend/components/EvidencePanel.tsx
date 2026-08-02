'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  ChevronDown,
} from 'lucide-react';
import { EvidenceItem } from '@/types';

interface EvidencePanelProps {
  evidence: EvidenceItem[];
}

export default function EvidencePanel({ evidence }: EvidencePanelProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const getStatusIcon = (status: EvidenceItem['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#1F7A3E] stroke-[2]" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-[#C08400] stroke-[2]" />;
      case 'danger':
        return <XCircle className="w-4 h-4 text-[#C62828] stroke-[2]" />;
      default:
        return <Info className="w-4 h-4 text-[#2563EB] stroke-[2]" />;
    }
  };

  const getStatusBadge = (status: EvidenceItem['status']) => {
    switch (status) {
      case 'success':
        return (
          <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1F7A3E] text-[10px] font-mono font-bold uppercase">
            VERIFIED SAFE
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#C08400] text-[10px] font-mono font-bold uppercase">
            SUSPICIOUS
          </span>
        );
      case 'danger':
        return (
          <span className="px-2 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828] text-[10px] font-mono font-bold uppercase">
            HIGH THREAT
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-[#FAFAFA] text-[#666666] text-[10px] font-mono font-bold uppercase">
            INFORMATIONAL
          </span>
        );
    }
  };

  return (
    <div className="truth-card p-6 sm:p-8 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl shadow-sm space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-4">
        <div>
          <h3 className="text-sm font-bold text-[#111111] uppercase font-mono tracking-wider">
            Evidence & Inspection Telemetry
          </h3>
          <p className="text-xs text-[#666666]">
            Multi-layered deterministic check results
          </p>
        </div>
        <span className="text-xs font-mono text-[#999999]">
          {evidence.length} CHECKS EVALUATED
        </span>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {evidence.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] overflow-hidden transition-all hover:border-[#D8D8D8]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left bg-[#FAFAFA] hover:bg-[#F6F6F7] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  {getStatusIcon(item.status)}
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#666666] uppercase block">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-[#111111] truncate">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {getStatusBadge(item.status)}
                  <ChevronDown
                    className={`w-4 h-4 text-[#999999] transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border-t border-[#E8E8E8] bg-[#FFFFFF] space-y-3 text-xs"
                  >
                    <p className="text-[#666666] leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-[#F6F6F7] flex items-center justify-between text-[11px] font-mono text-[#999999]">
                      <span>WEIGHT IMPACT: {item.weight}%</span>
                      <span>SCORE: {item.score}/100</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
