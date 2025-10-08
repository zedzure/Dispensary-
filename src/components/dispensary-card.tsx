
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
    <Card 
        className={cn("w-full overflow-hidden rounded-lg group transition-shadow hover:shadow-md text-left h-full cursor-pointer bg-card/60", className)}
        onClick={() => onDispensaryClick(dispensary)}
    >
      <div className="relative h-24 w-full">
        <Image
          src={dispensary.logo}
          data-ai-hint={dispensary.hint}
          alt={dispensary.name}
          fill
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform rounded-t-lg"
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
