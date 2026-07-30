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
    <div className="space-y-10 py-6">
      <div className="max-w-5xl mx-auto space-y-6 rounded-[32px] border border-white/10 bg-[#0B1121]/95 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111827]/85 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[#94A3B8]">
              <Shield className="h-4 w-4 text-[#60A5FA]" />
              Verify Console
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Verify Digital Authenticity.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-[#CBD5E1]">
                Select a content vector and launch a unified verification scan with explainable security results.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#E2E8F0] transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>
        </div>
      </div>

      {errorMsg ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl rounded-[28px] border border-[#F87171]/20 bg-[#7F1D1D]/10 p-4 text-sm text-[#FECACA] shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[#FECACA]" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-xs uppercase tracking-[0.25em] text-[#CBD5E1]">
              Dismiss
            </button>
          </div>
        </motion.div>
      ) : null}

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-white/10 bg-[#0F172A]/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.3)]">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#94A3B8]">Analysis Workflow</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Upload, analyze, and secure content.</h2>
              </div>
              <span className="rounded-full bg-[#111827]/90 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#94A3B8]">
                Direct Session
              </span>
            </div>
            <p className="text-sm leading-7 text-[#CBD5E1]">
              Truth Engine supports website URLs, email content, files, screenshots, QR codes, and voice media in one platform.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Continuous verification insights',
                'Zero-retention privacy mode',
                'AI explainability and threat evidence',
                'Fast verdicts for enterprise workflows',
              ].map((item, index) => (
                <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-[#CBD5E1]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#0F172A]/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.3)]">
          <div className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-5">
            {!isAnalyzing ? (
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">Ready to begin</p>
                <h3 className="text-xl font-semibold text-white">Start a new trust analysis</h3>
                <p className="text-sm leading-6 text-[#94A3B8]">
                  Upload or paste content and watch the verification pipeline activate with evidence-driven risk scoring.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-[#94A3B8]">Analysis in progress</p>
                <h3 className="text-xl font-semibold text-white">Processing your verification request</h3>
                <p className="text-sm leading-6 text-[#94A3B8]">
                  The Trust Engine is running multi-stage checks; the report will appear automatically when complete.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
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
                userId={null}
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
    </div>
  );
}
