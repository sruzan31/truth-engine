'use client';

import React from 'react';
import { Info, Shield, CheckCircle2, Scale, Cpu, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const methodologies = [
    {
      title: 'Website & URL Vector (100% Weight Tally)',
      metrics: [
        { label: 'HTTPS & SSL Configuration', weight: '15%', desc: 'Validates transport layer encryption & certificate chain authority.' },
        { label: 'Phishing Brand Heuristics', weight: '20%', desc: 'Inspects hostnames for brand spoofing, typosquatting & IDN homoglyphs.' },
        { label: 'WHOIS Registration Age', weight: '20%', desc: 'Analyzes creation timestamp. Newly registered domains carry risk penalties.' },
        { label: 'VirusTotal Database', weight: '25%', desc: 'Cross-checks with 70+ antiviruses and domain reputation databases.' },
        { label: 'Google Safe Browsing', weight: '20%', desc: 'Queries official Google phishing and malware registries.' },
      ]
    },
    {
      title: 'Email Inspection Vector',
      metrics: [
        { label: 'Sender Domain Match', weight: '25%', desc: 'Checks freemail tags and SPF/DKIM alignment indicators.' },
        { label: 'Body Hyperlink Extraction', weight: '25%', desc: 'Recursively scans target URLs embedded in mail body layers.' },
        { label: 'Gemini Semantic Audit', weight: '50%', desc: 'Checks for coercion, urgency, financial fraud & phishing copy.' },
      ]
    },
    {
      title: 'Images & QR Code Media',
      metrics: [
        { label: 'EXIF Metadata Analysis', weight: '30%', desc: 'Checks editor signatures, camera hardware data & timestamps.' },
        { label: 'QR Payload Resolution', weight: '20%', desc: 'Decodes QR image payload and passes target URLs to verification cluster.' },
        { label: 'Gemini Vision & OCR', weight: '50%', desc: 'Visual AI models detect deepfake manipulation & document spoofing.' },
      ]
    },
    {
      title: 'PDF & Text Documents',
      metrics: [
        { label: 'Structural Metadata', weight: '25%', desc: 'Checks PDF authoring software, incremental updates & JavaScript streams.' },
        { label: 'Embedded Link Scanning', weight: '25%', desc: 'Verifies embedded anchors in text blocks and form fields.' },
        { label: 'Gemini NLP Audit', weight: '50%', desc: 'Detects scam patterns, prompt injection, and invoice manipulation.' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      {/* Header */}
      <div className="space-y-1 border-b border-[#E8E8E8] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#E8E8E8] text-xs font-mono text-[#111111]">
          <Info className="w-3.5 h-3.5" />
          <span>ARCHITECTURE & METHODOLOGY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight">
          Trust Intelligence Methodology
        </h1>
        <p className="text-xs text-[#666666]">
          Deterministic evaluation algorithms and multi-layered verification models.
        </p>
      </div>

      {/* Vision Statement Card */}
      <div className="truth-card p-8 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111111]">The Core Engineering Question: "Can I trust this?"</h3>
            <p className="text-xs text-[#666666] font-mono">DETERMINISTIC & EXPLAINABLE SECURITY</p>
          </div>
        </div>
        <p className="text-xs text-[#111111] leading-relaxed p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8]">
          The Truth Engine replaces opaque binary classifications ("Safe" vs "Unsafe") with multi-layered, explainable risk profiling. By combining mathematical security ratings (SSL, WHOIS, VirusTotal) with natural language comprehension (Google Gemini AI), we formulate a 0-100 Trust Verdict backed by verifiable evidence trails.
        </p>
      </div>

      {/* Weight Breakdown Grid */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-[#111111] uppercase font-mono tracking-wider flex items-center gap-2">
          <Scale className="w-4 h-4" />
          Score Weight Allocation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methodologies.map((method, idx) => (
            <div
              key={idx}
              className="truth-card p-6 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-4"
            >
              <h4 className="text-xs font-mono font-bold text-[#111111] uppercase border-b border-[#E8E8E8] pb-2">
                {method.title}
              </h4>
              <div className="space-y-3">
                {method.metrics.map((metric, mIdx) => (
                  <div key={mIdx} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs font-semibold">
                      <span className="text-[#111111] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A3E] shrink-0" /> {metric.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#FAFAFA] border border-[#E8E8E8] text-[10px] font-mono font-bold text-[#111111]">
                        {metric.weight}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666666] pl-5 leading-normal">{metric.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
