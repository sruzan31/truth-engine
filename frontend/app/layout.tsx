import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const outfit = Outfit({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'The Truth Engine | AI Cybersecurity & Digital Trust Platform',
  description:
    'An intelligent digital trust engine to verify URLs, emails, messages, QR codes, and files for cyber safety, phishing signatures, and manipulation.',
  keywords: ['Cybersecurity', 'AI Phishing Detector', 'Safe Browsing', 'Gemini AI', 'WHOIS lookup', 'VirusTotal'],
  authors: [{ name: 'The Truth Engine Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-dark text-gray-100 selection:bg-primary/30 selection:text-white">
        <Navbar />
        <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
