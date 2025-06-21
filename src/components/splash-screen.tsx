
'use client';

import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onFinished: () => void;
}

export function SplashScreen({ onFinished }: SplashScreenProps) {
  // 1: initial logo entry
  // 2: logo exits, text types
  // 3: green logo re-enters behind text
  // 4: screen fades out
  const [step, setStep] = useState(1);

  useEffect(() => {
    const sequence = [
      setTimeout(() => setStep(2), 2000),      // Start logo exit and text typing
      setTimeout(() => setStep(3), 5300),      // Start re-entry after typing (2000 + 300 + 3000)
      setTimeout(() => setStep(4), 6800),      // Start fade out after re-entry (5300 + 1500)
      setTimeout(onFinished, 7800),         // Call onFinished after fade (6800 + 1000)
    ];
    return () => sequence.forEach(clearTimeout);
  }, [onFinished]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-primary transition-opacity duration-1000',
        step === 4 ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* The first leaf that does the U-exit */}
        <Leaf
          className={cn(
            'h-24 w-24 text-primary-foreground',
            step === 1 && 'animate-fade-in-down',
            step >= 2 && 'animate-u-exit'
          )}
          style={{ animationFillMode: 'forwards' }}
        />

        {/* The cursive text */}
        <h1
          className={cn(
            'mt-6 text-5xl font-cursive text-primary-foreground overflow-hidden whitespace-nowrap opacity-0 relative z-10',
            step >= 2 && 'animate-typing opacity-100'
          )}
          style={{ animationFillMode: 'forwards', animationDelay: '0.3s' }}
        >
          GreenLeaf Guide
        </h1>

        {/* The second, green leaf that re-enters */}
        <Leaf
          className={cn(
            'h-16 w-16 text-green-400 absolute -bottom-4 opacity-0',
            step >= 3 && 'animate-re-enter z-0'
          )}
          style={{ animationFillMode: 'forwards' }}
        />
      </div>
    </div>
  );
}
