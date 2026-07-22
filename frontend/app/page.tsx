'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
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

export default function LandingPage() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="space-y-32 py-8">
      {/* HERO SECTION */}
      <section className="relative pt-6 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline & Call to Action */}
        <motion.div
          className="lg:col-span-6 space-y-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#E8E8E8] text-xs font-mono text-[#111111]">
            <span className="w-2 h-2 rounded-full bg-[#1F7A3E]" />
            <span>TRUTH ENGINE v2.5 ENTERPRISE RELEASE</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.05]"
          >
            Know What<br />To Trust.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-[#666666] leading-relaxed max-w-xl font-normal"
          >
            AI-powered digital trust intelligence for websites, emails, images, PDFs, QR codes and online content.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/analyze"
              className="px-8 py-4 rounded-full bg-[#111111] hover:bg-black text-white font-semibold text-sm flex items-center gap-3 transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Analyze Content</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </Link>

            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-full bg-[#FFFFFF] border border-[#E8E8E8] hover:bg-[#FAFAFA] text-[#111111] font-semibold text-sm transition-all"
            >
              Explore Live Console
            </Link>
          </motion.div>

          {/* Micro Trust Stats */}
          <motion.div variants={fadeInUp} className="pt-6 border-t border-[#E8E8E8] grid grid-cols-3 gap-6 text-xs text-[#666666] font-mono">
            <div>
              <span className="block font-bold text-sm text-[#111111]">99.8%</span>
              <span>Detection Precision</span>
            </div>
            <div>
              <span className="block font-bold text-sm text-[#111111]">&lt;1.5s</span>
              <span>Verdict Latency</span>
            </div>
            <div>
              <span className="block font-bold text-sm text-[#111111]">Zero-Trust</span>
              <span>Data Protection</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Realistic Cybersecurity Dashboard Preview */}
        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <DashboardPreview />
        </motion.div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-[#999999] uppercase">
            METHODOLOGY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
            Three Elegant Steps to Verification.
          </h2>
          <p className="text-sm text-[#666666]">
            Seamless, deterministic security pipeline engineered for instant clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Upload Content',
              desc: 'Submit any website URL, raw text, email message, screenshot, image, PDF, or QR code into the secure console.',
              icon: UploadCloud,
            },
            {
              step: '02',
              title: 'AI Analysis',
              desc: 'Multi-modal analysis cross-references global threat databases, WHOIS registries, synthetic AI detectors, and cryptographic metadata.',
              icon: Cpu,
            },
            {
              step: '03',
              title: 'Trust Report',
              desc: 'Receive a comprehensive enterprise report with a 0-100 Trust Score, risk categorization, timeline, and actionable remediation steps.',
              icon: FileCheck2,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                className="truth-card truth-card-hover p-8 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-6 flex flex-col justify-between"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#E8E8E8] flex items-center justify-center text-[#111111]">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#999999]">
                      STEP {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#111111]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F6F6F7] text-[11px] font-mono text-[#999999] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#1F7A3E]" />
                  <span>Deterministic Audit Trail</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SUPPORTED INPUTS SECTION */}
      <section className="space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-[#999999] uppercase">
            VERSATILE COVERAGE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
            Supported Input Vectors.
          </h2>
          <p className="text-sm text-[#666666]">
            Deep inspection across digital attack vectors and content media.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Website', desc: 'URL, Domain & Phishing', icon: Globe },
            { label: 'Email', desc: 'Headers & Body Spores', icon: Mail },
            { label: 'Screenshot', desc: 'UI & Brand Impersonation', icon: Monitor },
            { label: 'Image', desc: 'Deepfake & EXIF Tampering', icon: ImageIcon },
            { label: 'PDF Document', desc: 'Malicious Code & Structure', icon: FileText },
            { label: 'QR Code', desc: 'Payload & Redirect Chain', icon: QrCode },
            { label: 'Raw Text', desc: 'AI Synthetics & Perplexity', icon: Layers },
            { label: 'Voice Audio', desc: 'Acoustic Voice Cloning', icon: Mic },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="truth-card truth-card-hover p-6 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-3"
              >
                <div className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-[#E8E8E8] flex items-center justify-center text-[#111111]">
                  <Icon className="w-4 h-4 stroke-[1.8]" />
                </div>
                <h4 className="text-sm font-bold text-[#111111]">{item.label}</h4>
                <p className="text-[11px] text-[#666666] leading-normal">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY TRUTH ENGINE (APPLE-STYLE FEATURE GRID) */}
      <section className="space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-[#999999] uppercase">
            ENTERPRISE ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
            Why Truth Engine.
          </h2>
          <p className="text-sm text-[#666666]">
            Built with uncompromising rigor for security operations and content verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Trust Score',
              subtitle: '0-100 Standardized Metric',
              desc: 'Single unified score calculated from thousands of weighted cryptographic & heuristic data points.',
              icon: Shield,
            },
            {
              title: 'Explainability',
              subtitle: 'Transparent AI Reasoning',
              desc: 'No black boxes. Every trust score includes complete evidence chains and transparent step-by-step logic.',
              icon: Eye,
            },
            {
              title: 'Threat Intelligence',
              subtitle: 'Global DB Integration',
              desc: 'Cross-checks against VirusTotal, Google Safe Browsing, WHOIS data, and real-time blacklists.',
              icon: Globe,
            },
            {
              title: 'AI Detection',
              subtitle: 'Synthetic Media Forensics',
              desc: 'Detects LLM generated copy, deepfake facial artifacts, voice clones, and AI image signatures.',
              icon: Cpu,
            },
            {
              title: 'Privacy First',
              subtitle: 'Zero Data Retention',
              desc: 'Analyzed files and URLs are processed in ephemeral sandboxes and destroyed immediately.',
              icon: Lock,
            },
            {
              title: 'Fast Analysis',
              subtitle: 'Sub-Second Verdicts',
              desc: 'Ultra-low latency execution pipeline engineered for high-throughput enterprise API integrations.',
              icon: Zap,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="truth-card truth-card-hover p-8 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-[#E8E8E8] flex items-center justify-center text-[#111111]">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#999999] uppercase block">
                    {item.subtitle}
                  </span>
                  <h3 className="text-lg font-bold text-[#111111]">{item.title}</h3>
                  <p className="text-xs text-[#666666] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="truth-card p-12 sm:p-16 bg-[#FAFAFA] border border-[#E8E8E8] rounded-2xl text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            Ready to Verify Digital Content?
          </h2>
          <p className="text-sm text-[#666666] leading-relaxed">
            Deploy Truth Engine in your enterprise or launch an instant verification scan in the browser.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/analyze"
            className="px-8 py-4 rounded-full bg-[#111111] hover:bg-black text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <span>Launch Verify Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
