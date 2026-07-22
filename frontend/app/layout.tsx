import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Truth Engine — Know What To Trust',
  description:
    'AI-powered digital trust intelligence for websites, emails, images, PDFs, QR codes and online content.',
  keywords: [
    'Cybersecurity',
    'Trust Intelligence',
    'AI Phishing Detector',
    'Content Verification',
    'Enterprise Security',
    'Deepfake Detection',
  ],
  authors: [{ name: 'Truth Engine Intelligence' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFFFF] text-[#111111] selection:bg-[#111111] selection:text-white">
        <Navbar />
        <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 pt-24 pb-16">
          <div className="max-w-[1280px] mx-auto w-full">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
