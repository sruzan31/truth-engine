'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060B14] text-[#94A3B8] py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 space-y-12">
        <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-[#111827] text-[#3B82F6] shadow-[0_20px_80px_rgba(59,130,246,0.16)]">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Truth Engine</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#94A3B8]">Digital Trust Platform</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#CBD5E1]">
              A premium AI digital trust platform for enterprises that demand clarity, speed, and zero-compromise security.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111827] px-4 py-2 text-xs text-[#A5B4FC]">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              Threat detection clusters operational
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#94A3B8] pb-3">Product</p>
            <ul className="space-y-3 text-sm text-[#CBD5E1]">
              <li>
                <Link href="/analyze" className="transition hover:text-white">
                  Verify Console
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition hover:text-white">
                  Security Dashboard
                </Link>
              </li>
              <li>
                <Link href="/history" className="transition hover:text-white">
                  Scan Archive
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-white">
                  Methodology
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#94A3B8] pb-3">Threat Vectors</p>
            <ul className="space-y-3 text-sm text-[#CBD5E1]">
              <li className="transition hover:text-white">Website & Phishing</li>
              <li className="transition hover:text-white">Deepfake Image Forensics</li>
              <li className="transition hover:text-white">PDF Threat Inspection</li>
              <li className="transition hover:text-white">QR Payload Analysis</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#94A3B8] pb-3">Legal</p>
            <ul className="space-y-3 text-sm text-[#CBD5E1]">
              <li>
                <Link href="/privacy" className="transition hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li className="transition hover:text-white flex items-center gap-1">
                API docs <ArrowUpRight className="h-3 w-3" />
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-[#94A3B8] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Truth Engine Inc. All rights reserved.</p>
          <p>Secure analysis with Google auth and FastAPI-backed trust signal orchestration.</p>
        </div>
      </div>
    </footer>
  );
}
