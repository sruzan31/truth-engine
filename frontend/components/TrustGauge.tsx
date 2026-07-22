'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TrustGaugeProps {
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
}

export default function TrustGauge({ score, riskLevel, confidence }: TrustGaugeProps) {
  // SVG Ring Calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getRiskConfig = () => {
    switch (riskLevel) {
      case 'low':
        return {
          label: 'LOW RISK',
          color: '#1F7A3E',
          bg: '#E8F5E9',
          border: '#C8E6C9',
          badgeText: 'Authentic & Verified Safe',
          icon: ShieldCheck,
        };
      case 'medium':
        return {
          label: 'MEDIUM RISK',
          color: '#C08400',
          bg: '#FFF8E1',
          border: '#FFE082',
          badgeText: 'Suspicious Anomalies Detected',
          icon: AlertTriangle,
        };
      case 'high':
      case 'critical':
        return {
          label: riskLevel === 'critical' ? 'CRITICAL THREAT' : 'HIGH RISK',
          color: '#C62828',
          bg: '#FFEBEE',
          border: '#FFCDD2',
          badgeText: 'Phishing / Malware Signature',
          icon: ShieldAlert,
        };
      default:
        return {
          label: 'UNKNOWN',
          color: '#666666',
          bg: '#FAFAFA',
          border: '#E8E8E8',
          badgeText: 'Analysis Pending',
          icon: Shield,
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <div className="truth-card p-6 sm:p-8 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl shadow-sm space-y-6">
      {/* Top Status Header */}
      <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold uppercase text-[#666666]">
            Trust Score Assessment
          </span>
        </div>
        <span
          className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border"
          style={{
            color: config.color,
            backgroundColor: config.bg,
            borderColor: config.border,
          }}
        >
          {config.label}
        </span>
      </div>

      {/* Main Gauge & Circular Display */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        {/* SVG Ring Gauge */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#F6F6F7"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke={config.color}
              strokeWidth="10"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold tracking-tight text-[#111111] font-mono">
              {score}
            </span>
            <span className="text-[10px] font-mono text-[#999999] uppercase tracking-wider">
              OUT OF 100
            </span>
          </div>
        </div>

        {/* Status Metrics Details */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#666666] uppercase">
              Verdict Summary
            </span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Icon className="w-5 h-5" style={{ color: config.color }} />
              <h4 className="text-base font-bold text-[#111111]">
                {config.badgeText}
              </h4>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8E8E8] grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[#999999] block text-[10px]">CONFIDENCE</span>
              <span className="text-[#111111] font-bold">{confidence}%</span>
            </div>
            <div>
              <span className="text-[#999999] block text-[10px]">EVIDENCE WEIGHT</span>
              <span className="text-[#111111] font-bold">Cryptographic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
