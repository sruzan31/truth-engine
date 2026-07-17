'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ShieldAlert, ArrowLeft, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import TrustGauge from '@/components/TrustGauge';
import EvidencePanel from '@/components/EvidencePanel';
import RecommendationCard from '@/components/RecommendationCard';
import apiService from '@/services/api';
import { AnalysisResult } from '@/types';
import { formatDate } from '@/lib/utils';

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const scanId = resolvedParams.id;

  const [scan, setScan] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const report = await apiService.getScanResult(scanId);
        setScan(report);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load scan report. The record may have expired or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [scanId]);

  const handleDownloadPdf = () => {
    if (typeof window !== 'undefined') {
      window.print(); // Uses standard print dialog, which allows saving as PDF
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 space-y-3">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-gray-400 font-mono uppercase tracking-widest">Loading Trust Verdict...</p>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="flex-grow flex items-center justify-center py-16">
        <div className="max-w-md w-full glass-panel rounded-3xl p-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Report Unobtainable</h3>
          <p className="text-xs text-gray-400 leading-relaxed">{error || 'Unable to locate report.'}</p>
          <div className="pt-2">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Console
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow space-y-6 py-4 print:p-0 print:bg-black">
      {/* Back link & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 print:hidden">
        <div className="space-y-1">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors font-medium mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Verify Console
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 border border-primary/20 p-1.5 rounded-lg">
              <FileText className="h-4.5 w-4.5 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Safety Assessment Report
            </h1>
          </div>
        </div>

        <div className="text-right text-[10px] sm:text-xs text-gray-500 font-mono leading-relaxed">
          <span>SCAN ID: {scan.scan_id}</span>
          <br />
          <span>DATE: {formatDate(scan.created_at)}</span>
        </div>
      </div>

      {/* Target Title Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-white/10 relative overflow-hidden">
        <div className="space-y-1 max-w-[70%] sm:max-w-[80%]">
          <span className="text-[10px] font-bold font-mono tracking-widest text-primary uppercase">
            TARGET {scan.scan_type} CONTENT
          </span>
          <h2 className="text-sm sm:text-base font-extrabold text-white font-mono truncate select-all">
            {scan.target}
          </h2>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/5 bg-black/40 text-[10px] font-bold font-mono uppercase text-gray-400">
          <span>{scan.scan_type} Analyzer</span>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Trust score and Recommendation actions) */}
        <div className="lg:col-span-5 space-y-6 print:col-span-12">
          <TrustGauge
            score={scan.trust_score}
            riskLevel={scan.risk_level}
            confidence={scan.confidence_score}
          />
          <RecommendationCard
            reasoning={scan.reasoning}
            recommendation={scan.recommendation}
            riskLevel={scan.risk_level}
            onDownloadPdf={handleDownloadPdf}
          />
        </div>

        {/* Right Column (Evidence Checklist) */}
        <div className="lg:col-span-7 space-y-6 print:col-span-12">
          <EvidencePanel evidence={scan.evidence} />
        </div>
      </div>
    </div>
  );
}
