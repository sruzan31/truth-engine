'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  FileText,
  AlertCircle,
  Share2,
  Download,
  Clock,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import TrustGauge from '@/components/TrustGauge';
import EvidencePanel from '@/components/EvidencePanel';
import RecommendationCard from '@/components/RecommendationCard';
import RiskTimeline from '@/components/RiskTimeline';
import Skeleton from '@/components/Skeleton';
import apiService from '@/services/api';
import { AnalysisResult } from '@/types';
import { formatDate } from '@/lib/utils';

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultsPage({ params }: ResultsPageProps) {
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
        setError('Failed to load security scan report. Record may have expired.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [scanId]);

  const handleDownloadPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 py-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="truth-card p-8 max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-[#C62828] mx-auto" />
          <h3 className="text-lg font-bold text-[#111111]">Report Not Available</h3>
          <p className="text-xs text-[#666666] leading-relaxed">{error || 'Scan record not found.'}</p>
          <div className="pt-2">
            <Link
              href="/analyze"
              className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Console</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 print:p-0 print:bg-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E8E8] pb-4 print:hidden">
        <div className="space-y-1">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#111111] transition-colors font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Console
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
              Enterprise Trust Audit Report
            </h1>
          </div>
        </div>

        <div className="text-right text-xs font-mono text-[#666666] space-y-0.5">
          <div>SCAN ID: <span className="text-[#111111] font-bold">{scan.scan_id}</span></div>
          <div>TIMESTAMP: <span>{formatDate(scan.created_at)}</span></div>
        </div>
      </div>

      {/* Target Info Banner */}
      <div className="truth-card p-5 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0 max-w-2xl">
          <span className="text-[10px] font-mono font-bold text-[#999999] uppercase tracking-wider block">
            EVALUATED {scan.scan_type.toUpperCase()} VECTOR TARGET
          </span>
          <h2 className="text-base font-bold text-[#111111] font-mono truncate select-all">
            {scan.target}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#E8E8E8] text-xs font-mono font-semibold text-[#111111] uppercase">
            {scan.scan_type} ANALYZER
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Trust Score, Risk Level & Recommendations */}
        <div className="lg:col-span-5 space-y-6">
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

        {/* Right Column: Timeline & Evidence Findings */}
        <div className="lg:col-span-7 space-y-6">
          <RiskTimeline />
          <EvidencePanel evidence={scan.evidence} />
        </div>
      </div>
    </div>
  );
}
