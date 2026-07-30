'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
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
      } catch (err: unknown) {
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
        <div className="rounded-[32px] border border-[#F87171]/20 bg-[#7F1D1D]/10 p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.2)] max-w-md w-full space-y-4">
          <AlertCircle className="mx-auto h-10 w-10 text-[#FECACA]" />
          <h3 className="text-2xl font-semibold text-white">Report Not Available</h3>
          <p className="text-sm text-[#CBD5E1] leading-relaxed">{error || 'Scan record not found.'}</p>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1F2937]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Console
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 print:p-0 print:bg-white">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="rounded-[32px] border border-white/10 bg-[#0B1121]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 text-sm text-[#94A3B8] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Console
          </Link>
          <div className="mt-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">Enterprise Trust Audit</span>
            <h1 className="text-3xl font-semibold text-white">Security scan report</h1>
            <p className="max-w-3xl text-sm leading-7 text-[#CBD5E1]">
              A detailed verdict for {scan.target} with risk levels, evidence findings, and recommended remediation steps.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-5 text-sm text-[#94A3B8] shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.32em] text-[#94A3B8]">Scan reference</span>
              <button
                onClick={handleDownloadPdf}
                className="rounded-full bg-[#3B82F6] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2563EB]"
              >
                Print report
              </button>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-white/80">
                <span>ID</span>
                <span className="font-semibold text-white truncate">{scan.scan_id}</span>
              </div>
              <div className="flex items-center justify-between text-white/80">
                <span>Date</span>
                <span>{formatDate(scan.created_at)}</span>
              </div>
              <div className="flex items-center justify-between text-white/80">
                <span>Vector</span>
                <span className="capitalize">{scan.scan_type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-[#0B1121]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <TrustGauge
              score={scan.trust_score}
              riskLevel={scan.risk_level}
              confidence={scan.confidence_score}
            />
          </div>
          <div className="rounded-[32px] border border-white/10 bg-[#0B1121]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <RiskTimeline />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-[#0B1121]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <RecommendationCard
              reasoning={scan.reasoning}
              recommendation={scan.recommendation}
              riskLevel={scan.risk_level}
              onDownloadPdf={handleDownloadPdf}
            />
          </div>
          <div className="rounded-[32px] border border-white/10 bg-[#0B1121]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <EvidencePanel evidence={scan.evidence} />
          </div>
        </div>
      </div>
    </div>
  );
}
