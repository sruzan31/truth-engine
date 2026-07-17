import React from 'react';
import Link from 'next/link';
import { Shield, Code, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-sm py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-white tracking-wide">THE TRUTH ENGINE</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm">
              An AI-powered Digital Trust and Threat Intel platform designed to identify malicious URLs, phishing emails, scam text, QR redirects, and visual deepfakes.
            </p>
          </div>

          {/* Nav Links Col */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/analyze" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Verify Console
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Security Dashboard
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Scan History
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Spec Col */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Engine Architecture
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Code className="h-4 w-4" /> Code
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} The Truth Engine. All Rights Reserved. Built with Next.js, FastAPI, & Gemini API.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Securing cyberspace with</span>
            <Heart className="h-3 w-3 text-danger fill-danger" />
            <span>and AI intelligence.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
