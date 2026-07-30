'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CalendarDays, ArrowLeft, User } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="space-y-10 py-8">
      <button
        type="button"
        onClick={() => router.push('/dashboard')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#CBD5E1] transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </button>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[32px] border border-white/10 bg-[#0B1121]/95 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 rounded-[28px] border border-white/10 bg-[#111827]/95 p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#3B82F6]/20 border-2 border-[#3B82F6]/40 text-[#60A5FA]">
                <User className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white">Truth Engine Security Console</h1>
                <p className="mt-2 text-sm text-[#94A3B8]">Direct Access Mode Active</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                <div className="flex items-center gap-3 text-[#60A5FA]">
                  <ShieldCheck className="h-5 w-5" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Security Status</p>
                    <p className="mt-2 text-sm font-semibold text-white">Active Protection</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                <div className="flex items-center gap-3 text-[#60A5FA]">
                  <CalendarDays className="h-5 w-5" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Platform Mode</p>
                    <p className="mt-2 text-sm font-semibold text-white">Zero-Dependency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] text-[#94A3B8]">Account posture</p>
              <h2 className="text-2xl font-semibold text-white">Direct Analytics Access</h2>
              <p className="text-sm leading-6 text-[#CBD5E1]">
                Truth Engine delivers real-time verification scans across URLs, emails, documents, images, and voice inputs with maximum speed and zero third-party auth requirements.
              </p>
              <div className="rounded-[24px] border border-white/10 bg-[#0B1121]/80 p-4 text-sm text-[#94A3B8]">
                <p className="font-semibold text-white">Session Security</p>
                <p className="mt-2">All analyses run in a direct, privacy-preserving session.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

