
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Dispensary } from '@/types/pos';
import { SheetMenu } from '../sheet-menu';
import { ScrollArea } from '../ui/scroll-area';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface DispensarySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dispensary: Dispensary;
}

export function DispensaryProductsSheet({ isOpen, onOpenChange, dispensary }: DispensarySheetProps) {
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
      <SheetContent side="left" className="w-full md:max-w-md p-0 flex flex-col bg-transparent backdrop-blur-xl border-border/20">
        <SheetHeader className="p-4 border-b flex flex-row items-center gap-4 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <ArrowLeft />
          </Button>
          <div>
            <SheetTitle>Products</SheetTitle>
            <SheetDescription>{dispensary.name}</SheetDescription>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-grow">
             <SheetMenu />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
