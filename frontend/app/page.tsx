'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, Check, Search, LayoutDashboard, Database, Sparkles,
  Terminal, ArrowRight, Link2, Mail, FileText, ImageIcon, QrCode, FileCheck
} from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const features = [
    {
      icon: Link2,
      title: 'Website & URL Safety',
      desc: 'Checks SSL configs, domain age, VirusTotal API databases, and Google Safe Browsing listings.',
    },
    {
      icon: Mail,
      title: 'Email Spoofing Audit',
      desc: 'Inspects email headers (SPF/DKIM), domain custom settings, link paths, and scam languages.',
    },
    {
      icon: FileText,
      title: 'Scam Text Check',
      desc: 'Uncovers emotional manipulation triggers, phishing lures, and text-based fraud via Gemini AI.',
    },
    {
      icon: ImageIcon,
      title: 'Image Forensics',
      desc: 'Decodes embedded metadata, extracts text via OCR, and inspects visual structures for editing.',
    },
    {
      icon: QrCode,
      title: 'QR Code Redirection',
      desc: 'Scans QR imagery, decodes embedded link addresses, and runs deep site reputation checks.',
    },
    {
      icon: FileCheck,
      title: 'PDF Document Analysis',
      desc: 'Parses structural attachments, links, and text contents to identify malicious script templates.',
    },
  ];

  return (
    <div className="flex-grow flex flex-col justify-center py-8">
      {/* Background radial glow */}
      <div className="absolute inset-0 top-16 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_50%)] pointer-events-none" />

      {/* Hero Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl mx-auto space-y-8 py-10 md:py-16 relative"
      >
        {/* Shield Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary tracking-wide uppercase font-mono">
          <Shield className="h-3.5 w-3.5" />
          Active AI Digital Trust Platform
        </motion.div>

        {/* Hero Title */}
        <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
          Can I trust this? <br className="hidden sm:inline" />
          Verify Digital Content with <span className="text-gradient">The Truth Engine</span>
        </motion.h1>

        {/* Hero Desc */}
        <motion.p variants={itemVariants} className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The Truth Engine scans Websites, Emails, Messages, QR Codes, and Documents using high-fidelity cybersecurity APIs combined with explainable Google Gemini AI models.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-4">
          <Link
            href="/analyze"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:brightness-110 active:scale-95 text-white font-bold text-sm tracking-wider shadow-lg shadow-primary/15 transition-all cursor-pointer"
          >
            Open Verify Console <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm tracking-wider hover:border-white/20 transition-all cursor-pointer"
          >
            Dashboard stats <LayoutDashboard className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Grid Features */}
      <div className="mt-16 md:mt-24 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Supported Scan Inputs</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            Our platform splits inspections into dedicated scanning nodes to ensure comprehensive data capture.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={itemVariants}
                className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-4"
              >
                <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shadow-sm shadow-primary/5">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-white text-base tracking-wide">{f.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Technology Integration banner */}
      <div className="mt-20 md:mt-28 py-10 border-y border-white/5 bg-black/20 text-center space-y-6">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
          Engine Intelligence Stack
        </h4>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 px-4">
          {[
            { name: 'Google Gemini Pro & Flash', icon: Sparkles },
            { name: 'VirusTotal Intelligence', icon: Database },
            { name: 'Google Safe Browsing', icon: Shield },
            { name: 'Secure Sandbox WHOIS', icon: Terminal },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-400 font-mono">
                <Icon className="h-4 w-4 text-secondary/75" />
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
