'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Lock,
  Globe,
  RefreshCw,
  Search,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<'live' | 'signals'>('live');

  return (
    <div className="truth-card overflow-hidden bg-[#FFFFFF] border border-[#E8E8E8] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl w-full">
      {/* Top Window Bar */}
      <div className="bg-[#FAFAFA] border-b border-[#E8E8E8] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E8E8E8]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E8E8E8]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E8E8E8]" />
          <span className="text-[11px] font-mono font-medium text-[#666666] ml-2">
            truth-engine // live-telemetry.console
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-[10px] font-medium text-[#1F7A3E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A3E] animate-pulse" />
            LIVE MONITORING
          </span>
        </div>
      </div>

      {/* Main Console Content */}
      <div className="p-5 sm:p-6 space-y-5 bg-[#FFFFFF]">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-1">
            <span className="text-[10px] font-mono font-semibold text-[#666666] uppercase">
              Trust Score
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-[#111111]">
                96.4
              </span>
              <span className="text-[10px] font-medium text-[#1F7A3E]">
                +1.2%
              </span>
            </div>
            <p className="text-[10px] text-[#999999]">Verified safe status</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-1">
            <span className="text-[10px] font-mono font-semibold text-[#666666] uppercase">
              Threat Vector
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-[#111111]">
                0
              </span>
              <span className="text-[10px] font-medium text-[#666666]">
                active
              </span>
            </div>
            <p className="text-[10px] text-[#999999]">Phishing / Malware zero</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-1">
            <span className="text-[10px] font-mono font-semibold text-[#666666] uppercase">
              Confidence
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-[#111111]">
                99.8%
              </span>
            </div>
            <p className="text-[10px] text-[#999999]">Gemini + Forensic validation</p>
          </div>
        </div>

        {/* Center Live Inspector Card */}
        <div className="p-4 rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#111111] stroke-[2]" />
              <span className="text-xs font-mono font-semibold text-[#111111]">
                https://verify.enterprise-node.io/checkout
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#F6F6F7] border border-[#E8E8E8] text-[10px] font-mono text-[#1F7A3E] font-semibold">
              PASSED (LOW RISK)
            </span>
          </div>

          {/* Breakdown checklist */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#666666] py-1 border-b border-[#F6F6F7]">
              <span className="flex items-center gap-2 font-medium text-[#111111]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A3E]" /> SSL & Domain Age Integrity
              </span>
              <span className="font-mono text-[11px] text-[#111111]">100/100</span>
            </div>
            <div className="flex items-center justify-between text-[#666666] py-1 border-b border-[#F6F6F7]">
              <span className="flex items-center gap-2 font-medium text-[#111111]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A3E]" /> Content AI Synthetics Fingerprint
              </span>
              <span className="font-mono text-[11px] text-[#111111]">No AI Anomaly</span>
            </div>
            <div className="flex items-center justify-between text-[#666666] py-1">
              <span className="flex items-center gap-2 font-medium text-[#111111]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A3E]" /> VirusTotal & Reputation DB
              </span>
              <span className="font-mono text-[11px] text-[#111111]">0 Blacklists</span>
            </div>
          </div>
        </div>

        {/* Live Feed Rows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#999999] px-1">
            <span>RECENT VERIFICATION STREAM</span>
            <span>LATENCY: 14ms</span>
          </div>

          <div className="space-y-1.5">
            {[
              { type: 'PDF', target: 'Q3_Financial_Statement_Signed.pdf', score: 99, status: 'Authentic' },
              { type: 'EMAIL', target: 'security-alert@internal-corp.net', score: 24, status: 'Phishing Risk' },
              { type: 'IMAGE', target: 'CEO_Statement_Press_Photo.png', score: 92, status: 'Human Capture' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAFAFA] border border-[#E8E8E8] text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E8E8E8] font-mono text-[9px] font-bold text-[#111111]">
                    {item.type}
                  </span>
                  <span className="font-mono text-[#111111] truncate max-w-[180px] sm:max-w-[220px]">
                    {item.target}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`font-mono font-semibold text-[11px] ${
                      item.score > 80 ? 'text-[#1F7A3E]' : 'text-[#C62828]'
                    }`}
                  >
                    {item.score}/100
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#999999]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
