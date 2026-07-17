'use client';

import React from 'react';
import { Info, Shield, CheckCircle, Scale, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const methodologies = [
    {
      title: 'Website URLs (100% Weight Tally)',
      metrics: [
        { label: 'HTTPS Configuration', weight: '15%', desc: 'Validates transport layer encryption.' },
        { label: 'Phishing Heuristics', weight: '20%', desc: 'Inspects hostnames for brand spoof tags.' },
        { label: 'WHOIS Registration Age', weight: '20%', desc: 'Analyzes creation age. New domains carry higher penalties.' },
        { label: 'VirusTotal threat database', weight: '25%', desc: 'Cross-checks with 70+ antiviruses.' },
        { label: 'Google Safe Browsing', weight: '20%', desc: 'Searches official Google malware databases.' },
      ]
    },
    {
      title: 'Emails Verification',
      metrics: [
        { label: 'Sender Reputation', weight: '25%', desc: 'Checks freemail tags and domain match indicators.' },
        { label: 'Hyperlinks Extraction', weight: '25%', desc: 'Scans target URLs inside mail body layers.' },
        { label: 'Gemini Semantic Check', weight: '50%', desc: 'Checks for coercion, urgency, and phishing language.' },
      ]
    },
    {
      title: 'Images & QR Codes',
      metrics: [
        { label: 'EXIF Metadata Analysis', weight: '30%', desc: 'Checks editor signatures and coordinates.' },
        { label: 'QR Redirection Check', weight: '20%', desc: 'Decodes and passes QR-URLs to main scanners.' },
        { label: 'Gemini Vision & OCR', weight: '50%', desc: 'Uses visual models to check spoof documents & text OCR.' },
      ]
    },
    {
      title: 'PDF & Text Documents',
      metrics: [
        { label: 'Structure Metadata', weight: '25%', desc: 'Checks creators and encryption flags.' },
        { label: 'Link Extractions', weight: '25%', desc: 'Verifies embedded anchors in text blocks.' },
        { label: 'Gemini NLP Content Audit', weight: '50%', desc: 'Finds scam patterns and invoice manipulation.' },
      ]
    }
  ];

  return (
    <div className="flex-grow max-w-4xl mx-auto w-full space-y-10 py-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-white/5 pb-4">
        <div className="bg-primary/10 border border-primary/20 p-1.5 rounded-lg">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">Methodology & Algorithms</h1>
          <p className="text-xs text-gray-400">Understanding the metrics behind Trust Scores and Threat triage.</p>
        </div>
      </div>

      {/* Vision Statement */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
        <div className="absolute top-0 left-0 h-40 w-40 bg-primary/5 rounded-br-full pointer-events-none" />
        <div className="bg-secondary/15 border border-secondary/20 p-3 rounded-2xl flex items-center justify-center shrink-0">
          <Brain className="h-10 w-10 text-secondary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-white text-base">The Core Question: "Can I trust this?"</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            The Truth Engine bypasses binary classification ('Safe' vs 'Unsafe') in favor of multi-layered risk profiling. By combining mathematical security ratings (SSL checks, WHOIS, VirusTotal) with natural language comprehension (Google Gemini AI), we formulate an explainable, contextual trust verdict.
          </p>
        </div>
      </div>

      {/* Weights breakdown */}
      <div className="space-y-6">
        <h3 className="font-bold text-white text-lg tracking-tight flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" /> Score Weights Aggregation
        </h3>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {methodologies.map((method, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="glass-panel rounded-2xl p-5 space-y-4"
            >
              <h4 className="font-bold text-white text-sm font-mono tracking-wide border-b border-white/5 pb-2">
                {method.title}
              </h4>
              <div className="space-y-3">
                {method.metrics.map((metric, mIdx) => (
                  <div key={mIdx} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs font-semibold">
                      <span className="text-gray-200 flex items-center gap-1.5">
                        <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" /> {metric.label}
                      </span>
                      <span className="text-primary font-mono text-[10px] bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-bold">
                        {metric.weight}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 pl-4.5 leading-normal">{metric.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
