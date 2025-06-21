
'use client';

import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onFinished: () => void;
}

export function SplashScreen({ onFinished }: SplashScreenProps) {
  const [step, setStep] = useState(1); // 1: logo enters, 2: logo exits & text types, 3: screen fades

  useEffect(() => {
    const sequence = [
      setTimeout(() => setStep(2), 1500), // Start logo exit and text typing
      setTimeout(() => setStep(3), 4500), // After animations, start screen fade
      setTimeout(onFinished, 5500),     // After screen fades, call onFinished
    ];
    return () => sequence.forEach(clearTimeout);
  }, [onFinished]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary transition-opacity duration-1000',
        step === 3 ? 'opacity-0' : 'opacity-100'
      )}
    >
      <Leaf
        className={cn(
          'h-24 w-24 text-primary-foreground',
          step === 1 && 'animate-fade-in-down',
          step >= 2 && 'animate-u-exit'
        )}
        style={{ animationFillMode: 'forwards' }}
      />
      <h1
        className={cn(
            'mt-6 text-5xl font-cursive text-primary-foreground overflow-hidden whitespace-nowrap opacity-0',
            step >= 2 && 'animate-typing opacity-100'
        )}
        style={{ animationFillMode: 'forwards', animationDelay: '0.3s' }}
      >
        GreenLeaf Guide
      </h1>
    </div>
  );
}
