'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TrustGaugeProps {
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  className?: string;
}

export default function TrustGauge({ score, riskLevel, confidence, className }: TrustGaugeProps) {
  // Circular parameters
  const radius = 90;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine colors based on risk
  const getRiskStyles = () => {
    switch (riskLevel) {
      case 'low':
        return {
          gradient: 'from-emerald-500 to-green-400',
          text: 'text-emerald-400',
          bgGlow: 'shadow-emerald-500/10',
          border: 'border-emerald-500/20',
          label: 'LOW RISK',
          colorCode: '#10b981',
        };
      case 'medium':
        return {
          gradient: 'from-amber-500 to-yellow-400',
          text: 'text-amber-400',
          bgGlow: 'shadow-amber-500/10',
          border: 'border-amber-500/20',
          label: 'MEDIUM RISK',
          colorCode: '#f59e0b',
        };
      case 'high':
        return {
          gradient: 'from-orange-500 to-red-400',
          text: 'text-orange-400',
          bgGlow: 'shadow-orange-500/10',
          border: 'border-orange-500/20',
          label: 'HIGH RISK',
          colorCode: '#f97316',
        };
      case 'critical':
        return {
          gradient: 'from-red-600 to-rose-500',
          text: 'text-rose-500',
          bgGlow: 'shadow-rose-500/15',
          border: 'border-rose-500/20',
          label: 'CRITICAL RISK',
          colorCode: '#ef4444',
        };
    }
  };

  const styles = getRiskStyles();

  return (
    <div className={cn('flex flex-col items-center justify-center p-6 glass-panel rounded-2xl relative overflow-hidden', styles.bgGlow, className)}>
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-radial-gradient from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* SVG Radial Progress */}
      <div className="relative h-56 w-56 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={styles.colorCode} stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.9} /> {/* Purple mix */}
            </linearGradient>
            <radialGradient id="innerShadow">
              <stop offset="90%" stopColor="#0000" />
              <stop offset="100%" stopColor="#000" stopOpacity={0.3} />
            </radialGradient>
          </defs>
          
          {/* Base circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          
          {/* Animated active path */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-gray-400 text-xs font-semibold tracking-widest uppercase">TRUST SCORE</span>
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl font-extrabold tracking-tighter text-white my-1 font-mono"
          >
            {score}
          </motion.span>
          <span className={cn('text-xs font-extrabold px-2.5 py-0.5 rounded-full border bg-black/40', styles.text, styles.border)}>
            {styles.label}
          </span>
        </div>
      </div>

      {/* Confidence Score Bar */}
      <div className="w-full mt-6 space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-gray-400">ANALYSIS CONFIDENCE</span>
          <span className="text-gray-200">{confidence}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          />
        </div>
        <p className="text-[10px] text-gray-500 text-center leading-normal">
          Confidence score measures the availability of public records, cryptographic configurations, and AI validation coverage.
        </p>
      </div>
    </div>
  );
}
