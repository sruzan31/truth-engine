'use client';

import React from 'react';

interface RiskTimelineItem {
  time: string;
  stage: string;
  status: 'passed' | 'warning' | 'critical';
  details: string;
}

export default function RiskTimeline() {
  const timelineEvents: RiskTimelineItem[] = [
    {
      time: '0.00s',
      stage: 'TLS & Domain Handshake',
      status: 'passed',
      details: 'Valid X.509 certificate issued by Let’s Encrypt. Domain age 4.2 years.',
    },
    {
      time: '0.24s',
      stage: 'DOM Visual Spoof Analysis',
      status: 'passed',
      details: 'Structural comparison against official brand fingerprints: 99.4% similarity threshold.',
    },
    {
      time: '0.68s',
      stage: 'AI Synthetic Text Scan',
      status: 'passed',
      details: 'Perplexity score 84.1; low probability of LLM-generated phishing copy.',
    },
    {
      time: '1.12s',
      stage: 'Reputation DB Cross-Reference',
      status: 'passed',
      details: 'Zero positive detections across VirusTotal, Google Safe Browsing, and PhishTank.',
    },
  ];

  return (
    <div className="truth-card p-6 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
        <h4 className="text-xs font-mono font-bold uppercase text-[#111111] tracking-wider">
          Threat Verification Timeline
        </h4>
        <span className="text-[10px] font-mono text-[#999999]">TOTAL TIME: 1.12s</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#E8E8E8]">
        {timelineEvents.map((evt, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-[#111111] border-2 border-white ring-2 ring-[#E8E8E8]" />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111111]">{evt.stage}</span>
                <span className="text-[10px] font-mono text-[#999999]">{evt.time}</span>
              </div>
              <p className="text-xs text-[#666666] leading-relaxed">{evt.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
