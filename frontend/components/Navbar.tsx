'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Settings, User, ArrowUpRight, Search, Activity, History, Info } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Overview', href: '/', icon: Activity },
    { label: 'Analyze', href: '/analyze', icon: Search },
    { label: 'Dashboard', href: '/dashboard', icon: Shield },
    { label: 'History', href: '/history', icon: History },
    { label: 'Architecture', href: '/about', icon: Info },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3 transition-all duration-300 pointer-events-none">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        {/* Floating Bar Container */}
        <div
          className={`w-full flex items-center justify-between px-5 py-2.5 rounded-full pointer-events-auto transition-all duration-300 ${
            scrolled
              ? 'bg-white/90 backdrop-blur-xl border border-[#E8E8E8] shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
              : 'bg-white/80 backdrop-blur-md border border-[#E8E8E8]/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
          }`}
        >
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-105">
              <Shield className="w-4 h-4 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-[#111111]">
                Truth Engine
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#999999] uppercase -mt-0.5">
                Enterprise
              </span>
            </div>
          </Link>

          {/* Navigation Centered */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F6F6F7] p-1 rounded-full border border-[#E8E8E8]/60">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#111111] font-semibold'
                      : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#E8E8E8]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <item.icon className="w-3.5 h-3.5 stroke-[1.8]" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/analyze"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-medium transition-all duration-200 shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Analyze Content</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
            </Link>

            <div className="h-4 w-[1px] bg-[#E8E8E8] hidden sm:block" />

            <Link
              href="/settings"
              className="p-2 rounded-full text-[#666666] hover:text-[#111111] hover:bg-[#F6F6F7] transition-colors border border-transparent hover:border-[#E8E8E8]"
              title="Settings"
            >
              <Settings className="w-4 h-4 stroke-[1.8]" />
            </Link>

            <button
              className="w-8 h-8 rounded-full bg-[#F6F6F7] border border-[#E8E8E8] flex items-center justify-center text-[#111111] hover:bg-[#E8E8E8] transition-colors"
              title="User Workspace"
            >
              <User className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
