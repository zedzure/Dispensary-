
'use client';

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from '@/lib/utils';
import type { Dispensary } from '@/types/pos';

interface DispensaryCardProps {
  dispensary: Dispensary;
  className?: string;
  onDispensaryClick: (dispensary: Dispensary) => void;
}

export function DispensaryCard({ dispensary, className, onDispensaryClick }: DispensaryCardProps) {
  return (
    <div 
        className={cn(
            "w-full h-full text-left cursor-pointer group transition-all duration-400 ease-in-out",
            "bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg",
            "rounded-[32px]", // Big, soft corners like the example
            "hover:transform hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-2xl", // Hover effect
            "overflow-hidden", // This is crucial to clip the image
            className
        )}
        onClick={() => onDispensaryClick(dispensary)}
    >
      <div className="relative h-24 w-full">
        <Image
          src={dispensary.logo}
          data-ai-hint={dispensary.hint}
          alt={dispensary.name}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-400 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold truncate text-foreground/90">{dispensary.name}</h3>
        <div className="flex items-center text-xs text-foreground/70 mt-1">
            <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
            <span>{dispensary.rating}</span>
            <span className="mx-1">&middot;</span>
            <span>{dispensary.deliveryTime} min</span>
        </div>
      </div>
    </div>
  );
}
