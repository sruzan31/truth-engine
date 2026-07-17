'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, History, Info, Settings, Search, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Mock Firebase Authentication state
  const [user, setUser] = useState<{ email: string; uid: string } | null>(null);

  useEffect(() => {
    // Read mock user from localStorage if any
    const savedUser = localStorage.getItem('truth_engine_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginToggle = () => {
    if (user) {
      localStorage.removeItem('truth_engine_user');
      setUser(null);
    } else {
      const mockUser = { email: 'sec-analyst@truthengine.ai', uid: 'usr_mock_12345' };
      localStorage.setItem('truth_engine_user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
  };

  const navItems = [
    { label: 'Verify Console', href: '/analyze', icon: Search },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'History log', href: '/history', icon: History },
    { label: 'Engine details', href: '/about', icon: Info },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 border-b',
        scrolled
          ? 'bg-black/70 backdrop-blur-md border-white/10'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Branding */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-lg shadow-primary/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-bg-dark">
                  <Shield className="h-5.5 w-5.5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-primary to-secondary opacity-0 blur group-hover:opacity-40 transition duration-500" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors duration-300">
                THE TRUTH ENGINE
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Trigger */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs text-gray-300 font-mono truncate max-w-[120px]">
                  {user.email.split('@')[0]}
                </span>
                <button
                  onClick={handleLoginToggle}
                  className="text-gray-400 hover:text-danger hover:scale-105 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginToggle}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-primary to-secondary hover:brightness-110 active:scale-95 shadow-md shadow-primary/10 cursor-pointer text-white transition-all"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-x-0 border-b border-white/10 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-base font-medium transition-all',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-white/10 pt-3 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-mono text-gray-400">{user.email}</span>
                <button
                  onClick={() => {
                    handleLoginToggle();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-danger text-sm hover:underline font-semibold"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleLoginToggle();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-sm font-semibold text-white"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
