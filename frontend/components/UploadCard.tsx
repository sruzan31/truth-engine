'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Link2, FileText, Mail, FileUp, ShieldAlert, Sparkles, 
  HelpCircle, Upload, CheckCircle2, RefreshCw 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadCardProps {
  onAnalyzeUrl: (url: string) => void;
  onAnalyzeText: (text: string) => void;
  onAnalyzeEmail: (subject: string, body: string, sender: string, headers: string) => void;
  onAnalyzeFile: (file: File, type: 'image' | 'qr' | 'pdf') => void;
  loading: boolean;
}

type TabType = 'url' | 'file' | 'text' | 'email';

export default function UploadCard({
  onAnalyzeUrl,
  onAnalyzeText,
  onAnalyzeEmail,
  onAnalyzeFile,
  loading,
}: UploadCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('url');
  
  // URL Tab States
  const [urlInput, setUrlInput] = useState('');
  
  // Text Tab States
  const [textInput, setTextInput] = useState('');
  
  // Email Tab States
  const [emailSender, setEmailSender] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailHeaders, setEmailHeaders] = useState('');
  
  // File Tab States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedFileType, setDetectedFileType] = useState<'image' | 'qr' | 'pdf' | null>(null);

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setSelectedFile(file);
    
    // Auto-detect type
    const mime = file.type.toLowerCase();
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (mime === 'application/pdf' || ext === 'pdf') {
      setDetectedFileType('pdf');
    } else if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) {
      // Guess QR if filename contains qr or by default let user select if unsure, but default to standard image
      if (file.name.toLowerCase().includes('qr')) {
        setDetectedFileType('qr');
      } else {
        setDetectedFileType('image');
      }
    } else {
      setDetectedFileType(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
  });

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onAnalyzeUrl(urlInput.trim());
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    onAnalyzeText(textInput.trim());
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailBody.trim()) return;
    onAnalyzeEmail(emailSubject, emailBody, emailSender, emailHeaders);
  };

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !detectedFileType) return;
    onAnalyzeFile(selectedFile, detectedFileType);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setDetectedFileType(null);
  };

  const tabs: { id: TabType; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'url', label: 'Scan URL', icon: Link2 },
    { id: 'file', label: 'Upload File', icon: FileUp },
    { id: 'text', label: 'Paste Text', icon: FileText },
    { id: 'email', label: 'Verify Email', icon: Mail },
  ];

  return (
    <div className="w-full glass-panel rounded-3xl p-6 relative overflow-hidden shadow-2xl">
      {/* Absolute design highlights */}
      <div className="absolute -top-10 -left-10 h-36 w-36 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 h-36 w-36 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tabs list */}
      <div className="flex border-b border-white/10 pb-3 mb-6 gap-1.5 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={loading}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide cursor-pointer transition-all duration-300',
                active
                  ? 'bg-primary/20 text-primary border border-primary/20 shadow-md shadow-primary/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {/* 1. URL SCAN PANEL */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider uppercase font-mono">
                Website URL
              </label>
              <div className="flex gap-2 flex-col sm:flex-row">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link2 className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="https://example-phishing-alert.com/login"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-10 pr-4 py-3 bg-black/45 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !urlInput.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:brightness-110 active:scale-95 text-white font-bold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                  VERIFY NOW
                </button>
              </div>
            </div>
            <div className="text-[10px] text-gray-500 flex items-center gap-1.5 leading-normal">
              <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
              <span>We check Domain Age, WHOIS details, SSL encryption status, VirusTotal API, and Google Safe Browsing logs.</span>
            </div>
          </form>
        )}

        {/* 2. FILE UPLOAD PANEL */}
        {activeTab === 'file' && (
          <form onSubmit={handleFileSubmit} className="space-y-4">
            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-white/5 hover:border-primary/40',
                  isDragActive && 'border-primary bg-primary/5'
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 text-gray-400 mb-3 animate-pulse-slow" />
                <h4 className="font-bold text-white text-sm tracking-wide">
                  Drag and drop your file here
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed">
                  Support images (.png, .jpg, .jpeg) for OCR/QR decoding or PDF files (.pdf) up to 10MB.
                </p>
              </div>
            ) : (
              <div className="bg-black/35 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 border border-primary/2 w-10 h-10 rounded-lg flex items-center justify-center text-primary shrink-0">
                      <FileUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm font-mono truncate max-w-sm sm:max-w-md">
                        {selectedFile.name}
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        File Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    disabled={loading}
                    className="text-xs text-gray-500 hover:text-danger cursor-pointer transition-all font-semibold"
                  >
                    Remove
                  </button>
                </div>

                {/* Content Type Selector */}
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                    Scan Method / Content Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'image', label: 'Image Scan' },
                      { id: 'qr', label: 'QR Decode' },
                      { id: 'pdf', label: 'PDF Text' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setDetectedFileType(type.id as any)}
                        disabled={loading}
                        className={cn(
                          'py-2 px-3 border rounded-xl text-xs font-semibold text-center transition-all cursor-pointer',
                          detectedFileType === type.id
                            ? 'bg-primary/25 border-primary text-primary'
                            : 'bg-black/30 border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  disabled={loading || !detectedFileType}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:brightness-110 active:scale-95 text-white font-bold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                  ANALYZE ATTACHMENT
                </button>
              </div>
            )}
            <div className="text-[10px] text-gray-500 flex items-center gap-1.5 leading-normal">
              <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
              <span>We check metadata integrity, run QR-link extraction, execute page link parsing, and use Gemini multimodal OCR.</span>
            </div>
          </form>
        )}

        {/* 3. TEXT SCAN PANEL */}
        {activeTab === 'text' && (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider uppercase font-mono">
                Text Content
              </label>
              <textarea
                required
                rows={5}
                placeholder="Paste suspicious text messages, crypto offers, prize alert notifications, or snippets of chats here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={loading}
                className="block w-full px-4 py-3 bg-black/45 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans leading-relaxed resize-y"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono">
                Length: {textInput.length} characters (Min 10 recommended)
              </span>
              <button
                type="submit"
                disabled={loading || textInput.trim().length < 5}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:brightness-110 active:scale-95 text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                SCAN TEXT COGNITION
              </button>
            </div>
          </form>
        )}

        {/* 4. EMAIL VERIFICATION PANEL */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-mono">
                  Sender (From)
                </label>
                <input
                  type="text"
                  placeholder="security@paypal-update-alert.com"
                  value={emailSender}
                  onChange={(e) => setEmailSender(e.target.value)}
                  disabled={loading}
                  className="block w-full px-3.5 py-2.5 bg-black/45 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-mono">
                  Subject Line
                </label>
                <input
                  type="text"
                  placeholder="Urgent: Your account is locked"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  disabled={loading}
                  className="block w-full px-3.5 py-2.5 bg-black/45 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-mono">
                Email Body Text
              </label>
              <textarea
                required
                rows={4}
                placeholder="Dear customer, please click this link immediately to restore your account..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                disabled={loading}
                className="block w-full px-3.5 py-2.5 bg-black/45 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all font-sans leading-relaxed resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-mono flex items-center gap-1">
                Raw Headers <span className="text-[9px] text-gray-500 font-sans font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Received: from mail.server.com ... SPF=FAIL DKIM=PASS"
                value={emailHeaders}
                onChange={(e) => setEmailHeaders(e.target.value)}
                disabled={loading}
                className="block w-full px-3.5 py-2.5 bg-black/45 border border-white/10 rounded-xl text-[10px] text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all font-mono leading-normal resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !emailBody.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:brightness-110 active:scale-95 text-white font-bold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              VERIFY EMAIL SAFETY
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
