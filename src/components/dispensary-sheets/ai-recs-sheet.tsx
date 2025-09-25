"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { Dispensary } from '@/types/pos';
import { StrainRecommenderForm } from '../strain-recommender-form';
import { ScrollArea } from '../ui/scroll-area';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface DispensarySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dispensary: Dispensary;
}

export function DispensaryAiRecsSheet({ isOpen, onOpenChange, dispensary }: DispensarySheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('sheet');
    router.push(pathname + '?' + params.toString());
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="left" className="w-full md:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b flex flex-row items-center gap-4 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <ArrowLeft />
          </Button>
          <div>
            <SheetTitle>AI Recommendations</SheetTitle>
            <SheetDescription>{dispensary.name}</SheetDescription>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-grow">
            <div className="p-4">
                <StrainRecommenderForm />
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
