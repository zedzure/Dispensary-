
'use client';

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from '@/lib/utils';
import type { Dispensary } from '@/types/pos';
import Link from 'next/link';

interface DispensaryCardProps {
  dispensary: Dispensary;
  className?: string;
  onDispensaryClick: (dispensary: Dispensary) => void;
}

export function DispensaryCard({ dispensary, className, onDispensaryClick }: DispensaryCardProps) {
  return (
    <Card 
        className={cn("w-full flex-shrink-0 overflow-hidden group transition-shadow text-left h-full cursor-pointer", "backdrop-blur-3xl bg-white/20 border border-white/30 rounded-3xl shadow-[inset_0_0_10px_rgba(255,255,255,0.4),0_8px_32px_rgba(31,38,135,0.25)] bg-gradient-to-br from-white/25 to-sky-200/10", className)}
        onClick={() => onDispensaryClick(dispensary)}
    >
      <div className="relative h-24 w-full">
        <Image
          src={dispensary.logo}
          data-ai-hint={dispensary.hint}
          alt={dispensary.name}
          fill
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform"
        />
      </div>
      <CardContent className="p-3">
        <h3 className="text-sm font-semibold truncate">{dispensary.name}</h3>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
            <span>{dispensary.rating}</span>
            <span className="mx-1">&middot;</span>
            <span>{dispensary.deliveryTime} min</span>
        </div>
      </CardContent>
    </Card>
  );
}
