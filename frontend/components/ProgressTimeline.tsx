'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, RefreshCw, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressTimelineProps {
  scanType: 'url' | 'email' | 'text' | 'image' | 'qr' | 'pdf';
  onComplete?: () => void;
}

interface Step {
  id: number;
  label: string;
  desc: string;
}

export default function ProgressTimeline({ scanType, onComplete }: ProgressTimelineProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const getStepsForType = (): Step[] => {
    const baseSteps = [
      { id: 0, label: 'Metadata Initialization', desc: 'Analyzing target details, encoding files, and verifying sizes.' },
    ];

    if (scanType === 'url') {
      return [
        ...baseSteps,
        { id: 1, label: 'SSL & Port Handshake', desc: 'Validating HTTPS certificates, checking port security.' },
        { id: 2, label: 'WHOIS Database Query', desc: 'Retrieving registrar history, records creation age.' },
        { id: 3, label: 'Threat Intel Lookup', desc: 'Checking VirusTotal records and Google Safe Browsing logs.' },
        { id: 4, label: 'Gemini AI Assessment', desc: 'Running heuristics check for credential theft and phishing models.' },
      ];
    } else if (scanType === 'email') {
      return [
        ...baseSteps,
        { id: 1, label: 'Sender Audits', desc: 'Checking for public domains and examining mail headers.' },
        { id: 2, label: 'Links Hyperlink Scan', desc: 'Checking targets of embedded URLs against database blacklists.' },
        { id: 3, label: 'Gemini Semantic Check', desc: 'Invoking AI NLP checks for coercive, spoofed, and scam languages.' },
        { id: 4, label: 'Aggregating Scores', desc: 'Summing weighted parameters to formulate the final rating.' },
      ];
    } else if (scanType === 'text') {
      return [
        ...baseSteps,
        { id: 1, label: 'Heuristics Audit', desc: 'Running regex checks for lottery, gift card, and crypto scams.' },
        { id: 2, label: 'Gemini NLP Assessment', desc: 'Invoking generative model to audit text factuality & emotional spikes.' },
        { id: 3, label: 'Safety Aggregation', desc: 'Computing weight percentages and building trust recommendations.' },
      ];
    } else if (scanType === 'image') {
      return [
        ...baseSteps,
        { id: 1, label: 'EXIF Metadata Analysis', desc: 'Checking image software tags for Photoshop GIMP alterations.' },
        { id: 2, label: 'QR Embedded Scanner', desc: 'Running visual filter to identify and decode internal QR codes.' },
        { id: 3, label: 'Gemini Visual Cognition', desc: 'Invoking Gemini Multimodal vision to scan text OCR and graphics.' },
        { id: 4, label: 'Threat Tally', desc: 'Consolidating evidence parameters to produce trust details.' },
      ];
    } else if (scanType === 'qr') {
      return [
        ...baseSteps,
        { id: 1, label: 'QR Image Decoding', desc: 'Executing pyzbar checks to extract embedded string payload.' },
        { id: 2, label: 'Decoded Target Routing', desc: 'Checking URL syntax and forwarding to core website analyzers.' },
        { id: 3, label: 'Domain Age & Reputation', desc: 'Querying WHOIS records, SSL details, and threat logs.' },
        { id: 4, label: 'AI Risk Formulation', desc: 'Evaluating findings and writing Gemini security reviews.' },
      ];
    } else { // pdf
      return [
        ...baseSteps,
        { id: 1, label: 'Structure Decomposition', desc: 'Decompressing PDF objects, checking producer metadata tags.' },
        { id: 2, label: 'Interactive Link Scanner', desc: 'Extracting and parsing embedded link anchors.' },
        { id: 3, label: 'Gemini OCR & Language', desc: 'Invoking generative AI to verify text logic for phishing templates.' },
        { id: 4, label: 'Triage Reports', desc: 'Formulating structural trust levels and finalizing recommendations.' },
      ];
    }
  };

  const steps = getStepsForType();

  useEffect(() => {
    const stepDurations = [600, 1000, 1000, 1200, 800]; // Duration per step in ms
    let index = 0;

    const timer = setInterval(() => {
      if (index < steps.length - 1) {
        index++;
        setCurrentStep(index);
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 900);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="w-full max-w-xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
      {/* Absolute Glow */}
      <div className="absolute -top-20 h-40 w-40 bg-primary/10 rounded-full blur-3xl" />
      
      {/* Shield pulse */}
      <div className="relative flex items-center justify-center h-20 w-20">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20 blur-md"
        />
        <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <Shield className="h-7 w-7 text-white animate-pulse-slow" />
        </div>
      </div>

      <div className="text-center space-y-1.5">
        <h3 className="text-xl font-extrabold text-white tracking-wide">Threat Intel Scanning</h3>
        <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">
          Content type: {scanType} • Analyzing layers...
        </p>
      </div>

      {/* Steps List */}
      <div className="w-full space-y-4">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex gap-4 items-start">
              {/* Left Line & Dot indicator */}
              <div className="flex flex-col items-center shrink-0 mt-1">
                <div
                  className={cn(
                    'h-6 w-6 rounded-full flex items-center justify-center border text-[10px] font-bold font-mono transition-all duration-300',
                    isCompleted && 'bg-primary/20 border-primary text-primary',
                    isActive && 'bg-secondary/15 border-secondary text-secondary',
                    !isCompleted && !isActive && 'border-white/10 text-gray-500 bg-white/5'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : isActive ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    step.id + 1
                  )}
                </div>
              </div>

              {/* Step info */}
              <div className="space-y-0.5 pb-2">
                <h4
                  className={cn(
                    'text-sm font-bold tracking-wide transition-colors duration-300',
                    isCompleted && 'text-gray-300',
                    isActive && 'text-white',
                    !isCompleted && !isActive && 'text-gray-500'
                  )}
                >
                  {step.label}
                </h4>
                {(isActive || isCompleted) && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-gray-400 leading-relaxed"
                  >
                    {step.desc}
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
