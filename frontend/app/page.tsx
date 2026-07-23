'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  UploadCloud,
  Cpu,
  FileCheck2,
  Globe,
  Mail,
  Image as ImageIcon,
  FileText,
  QrCode,
  Mic,
  Monitor,
  CheckCircle,
  Eye,
  Lock,
  Zap,
  Layers,
} from 'lucide-react';
import DashboardPreview from '@/components/DashboardPreview';

const featureCards = [
  {
    title: 'Trust Score',
    subtitle: 'Unified Confidence',
    desc: 'A single 0-100 trust metric built from cryptographic, behavioral, and synthetic signals.',
    icon: Shield,
  },
  {
    title: 'Explainability',
    subtitle: 'Transparent AI Reasoning',
    desc: 'Every verdict includes evidence chains, risk weights, and remediation context.',
    icon: Eye,
  },
  {
    title: 'Threat Intelligence',
    subtitle: 'Global Signal Fusion',
    desc: 'VirusTotal, Safe Browsing, WHOIS, and reputation intelligence fused into one verdict.',
    icon: Globe,
  },
  {
    title: 'Deepfake Forensics',
    subtitle: 'Media & Document Audit',
    desc: 'Detects synthetic imagery, manipulated PDFs, QR tampering, and cloned audio.',
    icon: Cpu,
  },
  {
    title: 'Zero Data Risk',
    subtitle: 'Ephemeral Analysis',
    desc: 'Uploaded assets are analyzed and discarded, preserving your privacy and compliance.',
    icon: Lock,
  },
  {
    title: 'Instant Verdicts',
    subtitle: 'Actionable Insight',
    desc: 'Enterprise-grade analysis delivered in seconds with a polished digital workflow.',
    icon: Zap,
  },
];

const supportCards = [
  { label: 'Website', desc: 'URL & phishing detection', icon: Globe },
  { label: 'Email', desc: 'Header & content risk analysis', icon: Mail },
  { label: 'Screenshot', desc: 'Visual brand impersonation', icon: Monitor },
  { label: 'Image', desc: 'Deepfake & EXIF forensics', icon: ImageIcon },
  { label: 'PDF', desc: 'Document tampering & payload scan', icon: FileText },
  { label: 'QR Code', desc: 'Payload resolution & redirect analytics', icon: QrCode },
  { label: 'Text', desc: 'AI synthetics and prompt injection', icon: Layers },
  { label: 'Voice', desc: 'Acoustic cloning and authenticity', icon: Mic },
];

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-12">
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0F172A]/85 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.4)] md:p-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
        <div className="pointer-events-none absolute right-0 top-20 h-48 w-48 rounded-full bg-[#06B6D4]/20 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-8 h-56 w-56 rounded-full bg-[#7C3AED]/20 blur-3xl" />

        <div className="relative grid gap-12 lg:grid-cols-[6fr_5fr] items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#3B82F6]/25 bg-[#3B82F6]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.36em] text-[#A5B4FC]">
              <Shield className="h-4 w-4 text-[#3B82F6]" />
              Enterprise Trust Platform
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-bold tracking-[-0.03em] text-white sm:text-6xl">
                Know What <span className="bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">To Trust.</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#CBD5E1]/90 sm:text-xl">
                AI-powered digital trust intelligence for websites, emails, documents, images, QR codes, and audio with explainable, enterprise-grade analysis.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center rounded-full bg-[#3B82F6] px-8 py-4 text-sm font-semibold text-white shadow-[0_24px_80px_rgba(59,130,246,0.25)] transition hover:-translate-y-0.5 hover:bg-[#2563EB]"
              >
                Start Analyzing
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Continue with Google
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 text-xs text-[#94A3B8]">
              <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-4">
                <p className="font-semibold text-white">99.8%</p>
                <p className="mt-1">Detection precision</p>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-4">
                <p className="font-semibold text-white">56ms</p>
                <p className="mt-1">Verdict latency</p>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-4">
                <p className="font-semibold text-white">Zero-Trust</p>
                <p className="mt-1">Data handling</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#060B14]/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.38)]"
          >
            <DashboardPreview />
            <div className="pointer-events-none absolute left-5 top-5 h-2.5 w-24 rounded-full bg-[#7C3AED]/30 blur-xl" />
            <div className="pointer-events-none absolute right-6 bottom-8 h-2.5 w-16 rounded-full bg-[#3B82F6]/30 blur-xl" />
          </motion.div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[#94A3B8]">
            TIMELESS TRUST
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A premium AI security platform for every digital verification workflow.
          </h2>
          <p className="max-w-2xl text-base leading-8 text-[#CBD5E1]/85">
            Truth Engine is designed for security teams, risk operators, and intelligence leaders who need instant, explainable verdicts on complex digital content.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#111827] text-[#3B82F6] shadow-[0_15px_40px_rgba(59,130,246,0.15)]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#94A3B8]">
                  {feature.subtitle}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#CBD5E1]">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="space-y-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
              SUPPORTED VECTORS
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Comprehensive coverage for every content type.
            </h2>
            <p className="max-w-xl text-base leading-8 text-[#CBD5E1]/85">
              Detect phishing, synthetic media, manipulated documents, malicious QR payloads, and suspicious audio with one unified engine.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {supportCards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-5"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-[#111827] text-[#06B6D4] shadow-[0_12px_32px_rgba(6,182,212,0.14)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[36px] border border-white/10 bg-[#111827]/95 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr] items-center">
          <div className="space-y-5">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#94A3B8]">
              TRUST DEMO
            </span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              See how a suspicious site becomes trusted after analysis.
            </h2>
            <p className="max-w-xl text-base leading-8 text-[#CBD5E1]">
              The Trust Engine visualizes risk reduction through layered checks and verdict confidence, so teams can act faster with assurance.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#0B1121]/90 p-6">
            <div className="rounded-[24px] border border-[#3B82F6]/15 bg-[#07101F] p-5">
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>ANALYSIS STREAM</span>
                <span>100% INTEGRITY</span>
              </div>
              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-white">
                    <span>Target</span>
                    <span className="text-[#06B6D4]">enterprise-login.app</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-white">
                    <span>Trust Score</span>
                    <span className="text-[#10B981] font-semibold">94</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-full w-[94%] rounded-full bg-[#10B981]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
