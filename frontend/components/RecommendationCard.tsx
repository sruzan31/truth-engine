'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Copy, Share2, Download, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [typedText, setTypedText] = useState('');

  // AI Typing effect for reasoning
  useEffect(() => {
    let index = 0;
    setTypedText('');
    const typingInterval = setInterval(() => {
      if (index < reasoning.length) {
        setTypedText((prev) => prev + reasoning.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 12); // Adjust character reveal speed

    return () => clearInterval(typingInterval);
  }, [reasoning]);

  const handleCopy = () => {
    const reportText = `THE TRUTH ENGINE SECURITY ASSESSMENT\nRisk Level: ${riskLevel.toUpperCase()}\n\nRecommendation:\n${recommendation}\n\nAI Reasoning:\n${reasoning}`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle className="h-6 w-6 text-emerald-400" />;
      case 'medium':
        return <AlertTriangle className="h-6 w-6 text-amber-400" />;
      case 'high':
        return <ShieldAlert className="h-6 w-6 text-orange-400" />;
      case 'critical':
        return <ShieldAlert className="h-6 w-6 text-rose-500" />;
    }
  };

  const getRiskBorder = () => {
    switch (riskLevel) {
      case 'low':
        return 'border-emerald-500/20 bg-emerald-500/5';
      case 'medium':
        return 'border-amber-500/20 bg-amber-500/5';
      case 'high':
        return 'border-orange-500/20 bg-orange-500/5';
      case 'critical':
        return 'border-rose-500/20 bg-rose-500/5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Recommended Action Alert */}
      <div className={cn('border rounded-2xl p-5 flex items-start gap-4', getRiskBorder())}>
        <div className="mt-0.5 shrink-0 bg-black/40 border border-white/5 p-2 rounded-xl">
          {getRiskIcon()}
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold font-mono tracking-widest text-gray-400 uppercase">
            RECOMMENDED ACTION
          </span>
          <h3 className="text-base font-extrabold text-white leading-normal tracking-wide">
            {recommendation}
          </h3>
        </div>
      </div>

      {/* AI Reasoning Section */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden space-y-4">
        {/* Glow */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-secondary/10 via-primary/5 to-transparent blur-2xl rounded-full" />

        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <div className="bg-primary/20 border border-primary/20 p-1.5 rounded-lg">
            <Sparkles className="h-4 w-4 text-primary animate-pulse-slow" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide">Explainable AI Reasoning</h3>
            <p className="text-[10px] text-gray-400 font-mono">MODEL: GEMINI-2.5-FLASH</p>
          </div>
        </div>

        <div className="min-h-[120px]">
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line select-text font-sans">
            {typedText}
            {typedText.length < reasoning.length && (
              <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse" />
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between border-t border-white/10 pt-4 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold text-gray-300 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy Text
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold text-gray-300 cursor-pointer"
            >
              {shared ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> URL Copied
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" /> Share Report
                </>
              )}
            </button>
          </div>

          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-primary/80 to-secondary/80 hover:brightness-110 active:scale-95 transition-all text-xs font-bold text-white shadow-sm shadow-primary/10 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Download PDF Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
