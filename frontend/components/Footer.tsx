'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E8E8E8] bg-[#FAFAFA] text-[#666666] text-xs py-16 mt-20">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 lg:px-16 space-y-12">
        {/* Upper grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#111111] flex items-center justify-center text-white">
                <Shield className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <span className="text-sm font-bold text-[#111111] tracking-tight">
                Truth Engine
              </span>
            </div>
            <p className="text-[#666666] text-xs leading-relaxed max-w-sm">
              Enterprise digital trust intelligence platform. Detecting AI manipulation, phishing vectors, and synthetic media with deterministic cryptographic evidence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-[11px] font-medium text-[#111111]">
              <span className="w-2 h-2 rounded-full bg-[#1F7A3E] animate-pulse" />
              <span>All Threat Detection Clusters Operational</span>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#111111] tracking-tight uppercase font-mono">
              Product
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/analyze" className="hover:text-[#111111] transition-colors">
                  Verify Console
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#111111] transition-colors">
                  Security Dashboard
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-[#111111] transition-colors">
                  Scan History Archive
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#111111] transition-colors">
                  Architecture & SLA
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#111111] tracking-tight uppercase font-mono">
              Threat Vectors
            </p>
            <ul className="space-y-2">
              <li>
                <span className="hover:text-[#111111] cursor-pointer">URL & Phishing Scan</span>
              </li>
              <li>
                <span className="hover:text-[#111111] cursor-pointer">Deepfake & Image Forensics</span>
              </li>
              <li>
                <span className="hover:text-[#111111] cursor-pointer">PDF Malware Inspection</span>
              </li>
              <li>
                <span className="hover:text-[#111111] cursor-pointer">QR Code Payload Verification</span>
              </li>
              <li>
                <span className="hover:text-[#111111] cursor-pointer">Voice Synthetic Analysis</span>
              </li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#111111] tracking-tight uppercase font-mono">
              Compliance & Legal
            </p>
            <ul className="space-y-2">
              <li>
                <span className="hover:text-[#111111] cursor-pointer">SOC2 Type II</span>
              </li>
              <li>
                <span className="hover:text-[#111111] cursor-pointer">Privacy Architecture</span>
              </li>
              <li>
                <span className="hover:text-[#111111] cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-[#111111] cursor-pointer flex items-center gap-1">
                  API Documentation <ArrowUpRight className="w-3 h-3" />
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Row */}
        <div className="pt-8 border-t border-[#E8E8E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#999999]">
          <p>© {new Date().getFullYear()} Truth Engine Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>PRESS <kbd className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E8E8E8] text-[#111111]">⌘K</kbd> FOR COMMAND BAR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
