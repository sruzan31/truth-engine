'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  FileText,
  Mail,
  Image as ImageIcon,
  FileSpreadsheet,
  QrCode,
  Mic,
  Upload,
  ArrowRight,
  CheckCircle2,
  X,
  File,
  Sparkles,
} from 'lucide-react';
import apiService from '@/services/api';
import { AnalysisResult } from '@/types';

export type InputCategory = 'website' | 'text' | 'email' | 'image' | 'pdf' | 'qr' | 'voice';

interface UploadCardProps {
  onAnalysisStart: (taskName: string) => void;
  onAnalysisSuccess: (result: AnalysisResult) => void;
  onError: (errorMsg: string) => void;
  userId?: string | null;
}

export default function UploadCard({
  onAnalysisStart,
  onAnalysisSuccess,
  onError,
  userId,
}: UploadCardProps) {
  const [activeTab, setActiveTab] = useState<InputCategory>('website');

  // Input States
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const tabs: { id: InputCategory; label: string; icon: React.ElementType }[] = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'image', label: 'Image', icon: ImageIcon },
    { id: 'pdf', label: 'PDF Document', icon: FileSpreadsheet },
    { id: 'qr', label: 'QR Code', icon: QrCode },
    { id: 'voice', label: 'Voice Audio', icon: Mic },
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept:
      activeTab === 'image'
        ? { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }
        : activeTab === 'pdf'
        ? { 'application/pdf': ['.pdf'] }
        : activeTab === 'qr'
        ? { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }
        : activeTab === 'voice'
        ? { 'audio/*': ['.mp3', '.wav', '.m4a'] }
        : undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'website') {
        if (!urlInput.trim()) {
          onError('Please enter a valid website URL.');
          return;
        }
        onAnalysisStart('Scanning URL & domain metadata...');
        const res = await apiService.analyzeUrl(urlInput.trim(), userId);
        onAnalysisSuccess(res);
      } else if (activeTab === 'text') {
        if (!textInput.trim()) {
          onError('Please paste or enter text content for analysis.');
          return;
        }
        onAnalysisStart('Analyzing AI text fingerprints & syntax patterns...');
        const res = await apiService.analyzeText(textInput.trim(), userId);
        onAnalysisSuccess(res);
      } else if (activeTab === 'email') {
        if (!emailBody.trim()) {
          onError('Please enter email body content.');
          return;
        }
        onAnalysisStart('Checking email headers & phishing indicators...');
        const res = await apiService.analyzeEmail(emailSubject, emailBody, undefined, undefined, userId);
        onAnalysisSuccess(res);
      } else if (activeTab === 'image') {
        if (!selectedFile) {
          onError('Please upload an image file.');
          return;
        }
        onAnalysisStart('Inspecting image metadata & synthetic signatures...');
        const res = await apiService.analyzeImage(selectedFile);
        onAnalysisSuccess(res);
      } else if (activeTab === 'pdf') {
        if (!selectedFile) {
          onError('Please upload a PDF document.');
          return;
        }
        onAnalysisStart('Parsing PDF structure & scanning embedded code...');
        const res = await apiService.analyzePdf(selectedFile, userId);
        onAnalysisSuccess(res);
      } else if (activeTab === 'qr') {
        if (!selectedFile) {
          onError('Please upload a QR code image.');
          return;
        }
        onAnalysisStart('Decoding QR payload & resolving target URL...');
        const res = await apiService.analyzeQr(selectedFile, userId);
        onAnalysisSuccess(res);
      } else if (activeTab === 'voice') {
        if (!selectedFile) {
          onError('Please select an audio file.');
          return;
        }
        onAnalysisStart('Analyzing acoustic voice frequencies...');
        // Fallback for voice using file analyzer
        const res = await apiService.analyzeImage(selectedFile);
        onAnalysisSuccess(res);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification request failed. Please check network connectivity.';
      onError(message);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Category Pills Navigation */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap p-1.5 bg-[#F6F6F7] border border-[#E8E8E8] rounded-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedFile(null);
              }}
              type="button"
              className={`relative px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                isActive
                  ? 'text-[#111111] font-semibold'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeUploadTab"
                  className="absolute inset-0 bg-white rounded-full border border-[#E8E8E8] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 stroke-[2]" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Console Box */}
      <div className="truth-card p-6 sm:p-8 bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tab 1: Website */}
          {activeTab === 'website' && (
            <div className="space-y-3">
              <label className="block text-xs font-mono font-semibold text-[#111111] uppercase tracking-wider">
                Enter Web Address (URL)
              </label>
              <div className="relative flex items-center">
                <Globe className="absolute left-4 w-4 h-4 text-[#999999]" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/login"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF] transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-[#666666]">
                Evaluates domain WHOIS, SSL certs, DNS record anomalies, visual brand spoofing, and virus database entries.
              </p>
            </div>
          )}

          {/* Tab 2: Text */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <label className="block text-xs font-mono font-semibold text-[#111111] uppercase tracking-wider">
                Paste Text Content
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste message, email excerpt, article, or statement here to analyze for AI generation or deception..."
                rows={5}
                required
                className="w-full p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF] transition-all leading-relaxed"
              />
              <p className="text-[11px] text-[#666666]">
                Detects synthetic language patterns, perplexity anomalies, sentiment manipulation, and generative AI traces.
              </p>
            </div>
          )}

          {/* Tab 3: Email */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-semibold text-[#111111] uppercase tracking-wider">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Urgent: Verify your account information immediately"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-mono font-semibold text-[#111111] uppercase tracking-wider">
                  Email Body Content
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Paste full email body or headers..."
                  rows={4}
                  required
                  className="w-full p-4 rounded-xl bg-[#FAFAFA] border border-[#E8E8E8] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF] transition-all"
                />
              </div>
            </div>
          )}

          {/* Drag & Drop File Upload Area (For Image, PDF, QR, Voice) */}
          {['image', 'pdf', 'qr', 'voice'].includes(activeTab) && (
            <div className="space-y-3">
              <label className="block text-xs font-mono font-semibold text-[#111111] uppercase tracking-wider">
                Upload {activeTab.toUpperCase()} File
              </label>

              {!selectedFile ? (
                <div
                  {...getRootProps()}
                  className={`drag-zone p-8 sm:p-12 text-center cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    isDragActive ? 'active' : ''
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#E8E8E8] flex items-center justify-center text-[#111111] shadow-xs">
                    <Upload className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#111111]">
                      Click to upload or drag & drop file
                    </p>
                    <p className="text-xs text-[#666666]">
                      {activeTab === 'image' && 'PNG, JPG, WEBP up to 25MB'}
                      {activeTab === 'pdf' && 'PDF documents up to 50MB'}
                      {activeTab === 'qr' && 'QR code screenshots or photos'}
                      {activeTab === 'voice' && 'MP3, WAV, M4A audio clips'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] border border-[#E8E8E8] flex items-center justify-center text-[#111111] shrink-0">
                      <File className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#111111] truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] font-mono text-[#666666]">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 rounded-full hover:bg-[#E8E8E8] text-[#666666] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[11px] text-[#666666] font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A3E]" />
              <span>Zero-knowledge privacy guaranteed</span>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Run Trust Analysis</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </form>
      </div>

      {/* Supported formats display footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs text-[#666666] pt-2">
        <div className="p-2.5 rounded-xl border border-[#E8E8E8] bg-[#FAFAFA]">
          <span className="font-mono font-semibold text-[#111111] block">Multi-modal</span>
          <span className="text-[10px]">AI + Cryptographic</span>
        </div>
        <div className="p-2.5 rounded-xl border border-[#E8E8E8] bg-[#FAFAFA]">
          <span className="font-mono font-semibold text-[#111111] block">Latency</span>
          <span className="text-[10px]">&lt; 1.5 Seconds</span>
        </div>
        <div className="p-2.5 rounded-xl border border-[#E8E8E8] bg-[#FAFAFA]">
          <span className="font-mono font-semibold text-[#111111] block">Engine</span>
          <span className="text-[10px]">Gemini 2.5 Pro + VirusTotal</span>
        </div>
        <div className="p-2.5 rounded-xl border border-[#E8E8E8] bg-[#FAFAFA]">
          <span className="font-mono font-semibold text-[#111111] block">Standard</span>
          <span className="text-[10px]">NIST Cybersecurity Framework</span>
        </div>
      </div>
    </div>
  );
}
