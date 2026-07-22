'use client';

import React from 'react';
import { Download, Share2, Shield, ArrowRight, CheckCircle2, AlertOctagon } from 'lucide-react';

interface RecommendationCardProps {
  reasoning: string;
  recommendation: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  onDownloadPdf?: () => void;
}

export default function RecommendationCard({
  reasoning,
  recommendation,
  riskLevel,
  onDownloadPdf,
}: RecommendationCardProps) {
  const isHighRisk = riskLevel === 'high' || riskLevel === 'critical';

  return (
    <div className="truth-card p-6 sm:p-8 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-4">
        <div>
          <h3 className="text-sm font-bold text-[#111111] uppercase font-mono tracking-wider">
            AI Synthesis & Remediation
          </h3>
          <p className="text-xs text-[#666666]">
            Actionable intelligence & threat containment
          </p>
        </div>
      </div>

      {/* Reasoning Section */}
      <div className="space-y-2">
        <label className="block text-xs font-mono font-semibold text-[#111111] uppercase tracking-wider">
          Analytical Reasoning
        </label>
        <p className="text-xs text-[#111111] leading-relaxed p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8]">
          {reasoning}
        </p>
      </div>

      {/* Recommendation Box */}
      <div className="space-y-2">
        <label className="block text-xs font-mono font-semibold text-[#111111] uppercase tracking-wider">
          Recommended Action
        </label>
        <div
          className={`p-4 rounded-xl border space-y-2 ${
            isHighRisk
              ? 'bg-[#FFEBEE] border-[#FFCDD2] text-[#C62828]'
              : 'bg-[#E8F5E9] border-[#C8E6C9] text-[#1F7A3E]'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {isHighRisk ? (
              <AlertOctagon className="w-4 h-4 text-[#C62828]" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#1F7A3E]" />
            )}
            <span>{isHighRisk ? 'Immediate Quarantine Advised' : 'Safe to Proceed'}</span>
          </div>
          <p className="text-xs leading-relaxed opacity-90">{recommendation}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8E8E8]">
        <button
          onClick={onDownloadPdf}
          type="button"
          className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Security Report PDF</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('Report link copied to clipboard.');
            }
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-[#FFFFFF] border border-[#E8E8E8] hover:bg-[#FAFAFA] text-[#111111] text-xs font-medium flex items-center justify-center gap-2 transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Audit Findings</span>
        </button>
      </div>
    </div>
  );
}
