'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, Cpu, Database, FileSearch, Lock } from 'lucide-react';

interface ProgressTimelineProps {
  onComplete?: () => void;
}

const STAGES = [
  { id: 'scan', label: 'Scanning URL & network telemetry...', icon: FileSearch, duration: 800 },
  { id: 'phishing', label: 'Checking phishing database & domain age...', icon: Database, duration: 900 },
  { id: 'ai', label: 'Analyzing AI generated text & synthetic signatures...', icon: Cpu, duration: 1000 },
  { id: 'metadata', label: 'Inspecting metadata & EXIF header integrity...', icon: Lock, duration: 800 },
  { id: 'reputation', label: 'Searching global threat intelligence & WHOIS...', icon: Database, duration: 900 },
  { id: 'verdict', label: 'Calculating Trust Score & generating report...', icon: Shield, duration: 700 },
];

export default function ProgressTimeline({ onComplete }: ProgressTimelineProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStepIndex < STAGES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, STAGES[currentStepIndex].duration);
      return () => clearTimeout(timer);
    } else if (currentStepIndex === STAGES.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, STAGES[currentStepIndex].duration);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, onComplete]);

  const progressPercent = Math.round(((currentStepIndex + 1) / STAGES.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto truth-card p-8 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl shadow-sm space-y-8">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#111111] flex items-center justify-center text-white">
            <Shield className="w-4 h-4 text-white stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111111]">
              Truth Intelligence Pipeline
            </h3>
            <p className="text-xs text-[#666666] font-mono">
              REAL-TIME DETERMINISTIC VERIFICATION
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold font-mono text-[#111111]">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Modern Minimal Progress Line */}
      <div className="space-y-2">
        <div className="w-full h-1.5 bg-[#F6F6F7] rounded-full overflow-hidden border border-[#E8E8E8]">
          <motion.div
            className="h-full bg-[#111111] rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: 'easeOut', duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[#999999]">
          <span>INITIATED</span>
          <span>EVALUATING SIGNATURES</span>
          <span>COMPLETE</span>
        </div>
      </div>

      {/* Task Steps Sequence */}
      <div className="space-y-3">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                isCurrent
                  ? 'bg-[#FAFAFA] border-[#111111] shadow-xs'
                  : isDone
                  ? 'bg-[#FFFFFF] border-[#E8E8E8] opacity-70'
                  : 'bg-[#FFFFFF] border-[#F6F6F7] opacity-40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    isDone
                      ? 'bg-[#1F7A3E] text-white'
                      : isCurrent
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#F6F6F7] text-[#999999] border border-[#E8E8E8]'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? 'text-[#111111] font-semibold'
                      : isDone
                      ? 'text-[#111111]'
                      : 'text-[#999999]'
                  }`}
                >
                  {stage.label}
                </span>
              </div>

              {isCurrent && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
                  <span className="text-[10px] font-mono text-[#2563EB] font-semibold">
                    PROCESSING
                  </span>
                </div>
              )}

              {isDone && (
                <span className="text-[10px] font-mono text-[#1F7A3E] font-semibold">
                  PASSED
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
