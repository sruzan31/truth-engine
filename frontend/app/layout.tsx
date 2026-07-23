import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Providers from '../components/Providers';

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
      <body className="min-h-full flex flex-col bg-[#060B14] text-white selection:bg-[#3B82F6] selection:text-white">
        <Providers>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_60%)]" />
            <Navbar />
            <main className="relative flex-grow w-full mx-auto px-4 sm:px-8 lg:px-12 pt-28 pb-20">
              <div className="mx-auto w-full max-w-[1440px]">{children}</div>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
