'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Loader2, LogIn, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login, error } = useAuth();

  if (user) {
    router.replace('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#060B14] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.16),_transparent_28%)]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-[#7C3AED]/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 top-32 h-72 w-72 rounded-full bg-[#06B6D4]/20 blur-[100px]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-xl rounded-[34px] border border-white/10 bg-[#0F172A]/95 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
        >
          <div className="space-y-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] shadow-[0_20px_80px_rgba(59,130,246,0.25)]">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.4em] text-[#94A3B8]">Truth Engine</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Secure your digital world.
              </h1>
              <p className="mx-auto max-w-xl text-sm leading-7 text-[#CBD5E1]/85">
                Sign in with Google to continue to the premium AI trust analysis platform backed by FastAPI and Firebase session security.
              </p>
            </div>
          </div>

          <motion.div
            whileHover={{ y: -4 }}
            className="mt-10 rounded-[28px] border border-white/10 bg-[#111827]/90 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.3)]"
          >
            <button
              type="button"
              onClick={async () => {
                try {
                  await login();
                } catch (_) {
                  /* handled in context */
                }
              }}
              className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_70px_rgba(59,130,246,0.24)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95 focus:outline-none"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="h-5 w-5" />
              )}
              <span>{loading ? 'Signing in…' : 'Continue with Google'}</span>
            </button>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4 text-left text-sm text-[#CBD5E1]">
              <p className="font-semibold text-white">Privacy first.</p>
              <p className="mt-2 text-[#94A3B8]">
                We never access your private emails. Firebase authentication only verifies your identity to create a secure session.
              </p>
            </div>

            {error ? (
              <div className="mt-5 rounded-3xl bg-[#EF4444]/10 border border-[#EF4444]/20 p-4 text-sm text-[#FEE2E2]">
                {error}
              </div>
            ) : null}

            <div className="mt-8 grid gap-3 text-xs text-[#94A3B8] sm:grid-cols-2">
              <a href="/privacy" className="transition hover:text-white">
                Privacy Policy
              </a>
              <a href="/terms" className="transition hover:text-white">
                Terms of Service
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
