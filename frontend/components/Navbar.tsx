'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield,
  Settings,
  ArrowUpRight,
  Search,
  Activity,
  History,
  Info,
  UserCircle,
} from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/', icon: Activity },
  { label: 'Analyze', href: '/analyze', icon: Search },
  { label: 'Dashboard', href: '/dashboard', icon: Shield },
  { label: 'History', href: '/history', icon: History },
  { label: 'About', href: '/about', icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();

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
            href="/profile"
            className="rounded-full border border-white/10 bg-white/5 p-3 text-[#94A3B8] transition hover:bg-white/10 hover:text-white"
            title="Profile"
          >
            <UserCircle className="h-4 w-4" />
          </Link>

          <Link
            href="/settings"
            className="rounded-full border border-white/10 bg-white/5 p-3 text-[#94A3B8] transition hover:bg-white/10 hover:text-white"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

