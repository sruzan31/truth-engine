'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-[#FAFAFA] border border-[#E8E8E8] rounded-xl animate-pulse ${className}`}
    />
  );
}
