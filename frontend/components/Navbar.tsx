'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield,
  Settings,
  User,
  ArrowUpRight,
  Search,
  Activity,
  History,
  Info,
  ChevronDown,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 14);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { user, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/', icon: Activity },
    { label: 'Analyze', href: '/analyze', icon: Search },
    { label: 'Dashboard', href: '/dashboard', icon: Shield },
    { label: 'History', href: '/history', icon: History },
    { label: 'About', href: '/about', icon: Info },
  ];

  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push('/login');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#060B14]/90 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#111827] text-[#3B82F6] shadow-[0_20px_80px_rgba(59,130,246,0.16)]">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-white">Truth Engine</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#94A3B8]">Digital Trust</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-sm text-[#CBD5E1] backdrop-blur-md md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/analyze"
            className="hidden items-center gap-2 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-4 py-2 text-sm font-semibold text-[#E0F2FE] transition hover:bg-[#3B82F6]/20 md:inline-flex"
          >
            <ArrowUpRight className="h-4 w-4" />
            Analyze
          </Link>

          <Link
            href="/settings"
            className="rounded-full border border-white/10 bg-white/5 p-3 text-[#94A3B8] transition hover:bg-white/10 hover:text-white"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((value) => !value)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0F172A] px-3 py-2 text-sm text-white shadow-[0_10px_40px_rgba(0,0,0,0.16)] transition hover:border-[#3B82F6]"
              >
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="hidden sm:inline-block">{user.name.split(' ')[0]}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-3 w-52 rounded-3xl border border-white/10 bg-[#0F172A] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-white transition hover:bg-white/10"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Shield className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-white transition hover:bg-white/10"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserCircle className="h-4 w-4" /> Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="rounded-full bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
            >
              {loading ? 'Loading…' : 'Login'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
