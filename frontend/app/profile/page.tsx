'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { ShieldCheck, CalendarDays, ArrowLeft, Star, Clock3 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060B14] p-6">
        <div className="rounded-[32px] border border-white/10 bg-[#0F172A]/95 px-10 py-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] text-white">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

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
              <img
                src={user.photoURL}
                alt={user.name}
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl"
              />
              <div>
                <h1 className="text-3xl font-semibold text-white">{user.name}</h1>
                <p className="mt-2 text-sm text-[#94A3B8]">{user.email}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                <div className="flex items-center gap-3 text-[#60A5FA]">
                  <ShieldCheck className="h-5 w-5" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Safe Identity</p>
                    <p className="mt-2 text-sm font-semibold text-white">Google-authenticated</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                <div className="flex items-center gap-3 text-[#60A5FA]">
                  <CalendarDays className="h-5 w-5" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Joined</p>
                    <p className="mt-2 text-sm font-semibold text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                <div className="flex items-center gap-3 text-[#60A5FA]">
                  <Clock3 className="h-5 w-5" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Last login</p>
                    <p className="mt-2 text-sm font-semibold text-white">{new Date(user.lastLogin).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                <div className="flex items-center gap-3 text-[#60A5FA]">
                  <Star className="h-5 w-5" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Trust Analyses</p>
                    <p className="mt-2 text-sm font-semibold text-white">{user.analysisCount ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#111827]/95 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] text-[#94A3B8]">Account status</p>
              <h2 className="text-2xl font-semibold text-white">Premium security posture</h2>
              <p className="text-sm leading-6 text-[#CBD5E1]">
                Truth Engine preserves your session securely while delivering a refined analytics workspace. Your Google login keeps trust reports aligned across devices.
              </p>
              <div className="rounded-[24px] border border-white/10 bg-[#0B1121]/80 p-4 text-sm text-[#94A3B8]">
                <p className="font-semibold text-white">Session retention</p>
                <p className="mt-2">Authenticated sessions persist securely through Firebase and backend token validation.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
