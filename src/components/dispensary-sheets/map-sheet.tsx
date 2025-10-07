
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react';
import type { Dispensary } from '@/types/pos';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface DispensarySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dispensary: Dispensary;
}

export function DispensaryMapSheet({ isOpen, onOpenChange, dispensary }: DispensarySheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('sheet');
    router.push(pathname + '?' + params.toString());
  };
    
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${dispensary.lat},${dispensary.lng}`;
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="left" className="w-full md:max-w-md p-0 bg-transparent backdrop-blur-xl border-border/20">
        <SheetHeader className="p-4 border-b flex flex-row items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <ArrowLeft />
          </Button>
          <div>
            <SheetTitle>Location Map</SheetTitle>
            <SheetDescription>{dispensary.name}</SheetDescription>
          </div>
        </SheetHeader>
        <div className="p-6 text-center space-y-4">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">Get Directions</h3>
            <p className="text-sm text-muted-foreground">Open Google Maps to see the route to this dispensary.</p>
            <Button asChild>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    Open in Google Maps
                </a>
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
