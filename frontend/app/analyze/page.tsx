'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import UploadCard from '@/components/UploadCard';
import ProgressTimeline from '@/components/ProgressTimeline';
import { AnalysisResult } from '@/types';

export default function AnalyzePage() {
  const router = useRouter();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTaskName, setActiveTaskName] = useState('Initiating Trust Engine Analysis...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleStart = (taskName: string) => {
    setErrorMsg(null);
    setActiveTaskName(taskName);
    setIsAnalyzing(true);
  };

  const handleSuccess = (result: AnalysisResult) => {
    setAnalysisResult(result);
  };

  const handleProgressComplete = () => {
    if (analysisResult) {
      router.push(`/results/${analysisResult.scan_id}`);
    }
  };

  const handleError = (msg: string) => {
    setIsAnalyzing(false);
    setErrorMsg(msg);
  };

  return (
    <div className="py-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#E8E8E8] text-xs font-mono text-[#111111]">
          <Shield className="w-3.5 h-3.5 text-[#111111]" />
          <span>VERIFY CONSOLE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          Verify Digital Authenticity.
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] max-w-lg mx-auto leading-relaxed">
          Select input vector below to run multi-modal AI threat inspection & cryptographic validation.
        </p>
      </div>

      {/* Error Toast / Alert */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs font-medium flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-xs underline hover:no-underline font-mono"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Console State Switcher */}
      <AnimatePresence mode="wait">
        {!isAnalyzing ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <UploadCard
              onAnalysisStart={handleStart}
              onAnalysisSuccess={handleSuccess}
              onError={handleError}
            />
          </motion.div>
        ) : (
          <motion.div
            key="progress"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProgressTimeline
              initialTaskName={activeTaskName}
              onComplete={handleProgressComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
