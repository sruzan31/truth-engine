'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Info, ShieldCheck, Sparkles } from 'lucide-react';
import UploadCard from '@/components/UploadCard';
import ProgressTimeline from '@/components/ProgressTimeline';
import apiService from '@/services/api';

export default function AnalyzePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scanType, setScanType] = useState<'url' | 'email' | 'text' | 'image' | 'qr' | 'pdf' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerScan = async (type: typeof scanType, scanFn: () => Promise<any>) => {
    setLoading(true);
    setScanType(type);
    setError(null);

    try {
      // Mock delay to let the ProgressTimeline load nicely for UX
      const [result] = await Promise.all([
        scanFn(),
        new Promise((resolve) => setTimeout(resolve, 4000)), // Ensure user sees timeline steps
      ]);
      
      // Redirect to dynamic results page
      router.push(`/results/${result.scan_id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during analysis.');
      setLoading(false);
    }
  };

  const handleAnalyzeUrl = (url: string) => {
    triggerScan('url', () => apiService.analyzeUrl(url));
  };

  const handleAnalyzeText = (text: string) => {
    triggerScan('text', () => apiService.analyzeText(text));
  };

  const handleAnalyzeEmail = (subject: string, body: string, sender: string, headers: string) => {
    triggerScan('email', () => apiService.analyzeEmail(subject, body, sender, headers));
  };

  const handleAnalyzeFile = (file: File, type: 'image' | 'qr' | 'pdf') => {
    if (type === 'image') {
      triggerScan('image', () => apiService.analyzeImage(file));
    } else if (type === 'qr') {
      triggerScan('qr', () => apiService.analyzeQr(file));
    } else {
      triggerScan('pdf', () => apiService.analyzePdf(file));
    }
  };

  if (loading && scanType) {
    return (
      <div className="flex-grow flex items-center justify-center py-12">
        <ProgressTimeline scanType={scanType} />
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-4xl mx-auto w-full py-6 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Digital Content Verifier
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
          Input suspicious URLs, files, letters, or codes. The Truth Engine evaluates mathematical reputation logs and visual parameters.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="border border-rose-500/20 bg-rose-500/5 rounded-2xl p-4 flex gap-3.5 items-start">
          <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">Verification Failed</h4>
            <p className="text-xs text-gray-400 leading-normal">{error}</p>
          </div>
        </div>
      )}

      {/* Main Form Console */}
      <UploadCard
        onAnalyzeUrl={handleAnalyzeUrl}
        onAnalyzeText={handleAnalyzeText}
        onAnalyzeEmail={handleAnalyzeEmail}
        onAnalyzeFile={handleAnalyzeFile}
        loading={loading}
      />

      {/* Trust Advisory banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="border border-white/5 bg-black/25 rounded-2xl p-5 flex gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-white text-xs tracking-wider uppercase font-mono">Explainable Verdicts</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              We compile cryptographic certificates, public register dates, content structures, and call the Gemini API to explain the reasoning behind every verdict.
            </p>
          </div>
        </div>

        <div className="border border-white/5 bg-black/25 rounded-2xl p-5 flex gap-3">
          <ShieldCheck className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-white text-xs tracking-wider uppercase font-mono">No Private Retention</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              We never inspect nor store raw credentials, codes, or private files. File checks run exclusively in volatile structures and details delete upon completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
